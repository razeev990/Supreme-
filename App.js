import React, { useState, useEffect, useRef } from 'react';
import { Alert, Animated, Easing, BackHandler } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Audio } from 'expo-av';
import { createAgoraRtcEngine, ChannelProfileType, ClientRoleType } from 'react-native-agora';

// ==========================================
// 📥 1. IMPORTING SCREENS
// ==========================================
import AuthScreen from './src/screens/AuthScreen';
import DashboardScreen from './src/screens/DashboardScreen';
import GameScreen from './src/screens/GameScreen';

// ==========================================
// 📥 2. IMPORTING UTILS, SERVICES & CONFIGS
// ==========================================
import { SUPABASE_PROJECT_REF, SUPABASE_ANON_KEY, SUPABASE_REST_URL, AGORA_APP_ID, supabaseHeaders } from './src/constants/config';
import { ACTIVE_COLORS, START_INDEX, SAFE_INDEXES, ALL_COLORS } from './src/constants/gameData';
import { getStrategicMoveIndex } from './src/utils/aiLogic';
import { syncUserToCloud, updateLastSeenCloud, syncUserCoinsToCloud, fetchCloudLeaderboard } from './src/services/supabaseService';

export default function App() {
  // ==========================================
  // 🧠 GLOBAL STATE MANAGEMENT
  // ==========================================
  
  // Auth & User States
  const [currentUser, setCurrentUser] = useState(null);
  const [authMode, setAuthMode] = useState('LOGIN');
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [newPasswordInput, setNewPasswordInput] = useState('');
  const [usernameInput, setUsernameInput] = useState('');
  const [userAvatar, setUserAvatar] = useState('👸');
  
  // App Navigation & Modes
  const [gameMode, setGameMode] = useState(null); 
  const [playType, setPlayType] = useState('SOLO');
  
  // Game Variables
  const [selectedEntryFee, setSelectedEntryFee] = useState(50);
  const [matchPrizePool, setMatchPrizePool] = useState(0);
  const [myColor, setMyColor] = useState('BLUE');
  const [activeColors, setActiveColors] = useState(['BLUE','GREEN']);
  const [turnIndex, setTurnIndex] = useState(0);
  const [turnTimeLeft, setTurnTimeLeft] = useState(30);
  
  // Voice & Chat
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInputText, setChatInputText] = useState('');
  const [isMicOn, setIsMicOn] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // System Refs
  const ws = useRef(null);
  const agoraEngine = useRef(null);
  const currentUserRef = useRef(currentUser);
  useEffect(() => { currentUserRef.current = currentUser; }, [currentUser]);

  // ==========================================
  // 🚀 INITIALIZATION & APP LAUNCH
  // ==========================================
  useEffect(() => {
    (async () => {
      try {
        const saved = await AsyncStorage.getItem('@ludo_supreme_user');
        if (saved) {
          const parsed = JSON.parse(saved);
          setCurrentUser(parsed);
          if (parsed.avatar) setUserAvatar(parsed.avatar);
          await syncUserToCloud(parsed);
        }
      } catch (err) {}
    })();
  }, []);

  // Background Sync (Heartbeat)
  useEffect(() => {
    if (!currentUser?.playerId) return;
    updateLastSeenCloud(currentUser.playerId);
    const interval = setInterval(() => {
      updateLastSeenCloud(currentUser.playerId);
    }, 4000);
    return () => clearInterval(interval);
  }, [currentUser?.playerId]);

  // ==========================================
  // 🔐 AUTHENTICATION LOGIC
  // ==========================================
  const handleAuthSubmit = async () => {
    try {
      const email = emailInput.trim().toLowerCase();
      const password = passwordInput.trim();
      const username = usernameInput.trim();

      if (!email) { Alert.alert('Error', 'Please enter your email.'); return; }

      if (authMode === 'SIGNUP') {
        if (!username) { Alert.alert('Error', 'Please enter a username.'); return; }
        if (password.length < 6) { Alert.alert('Error', 'Password must be at least 6 characters.'); return; }

        const checkResponse = await fetch(`${SUPABASE_REST_URL}/ludo_users?email=eq.${encodeURIComponent(email)}&limit=1`, { headers: supabaseHeaders });
        const existingUsers = await checkResponse.json();
        if (Array.isArray(existingUsers) && existingUsers.length > 0) {
          Alert.alert('Error', 'Account already exists. Please login.'); return;
        }

        const newUser = { playerId: `player_${Date.now()}`, name: username, email, password, coins: 2000, avatar: '👸' };
        await syncUserToCloud(newUser);
        await AsyncStorage.setItem('@ludo_supreme_user', JSON.stringify(newUser));
        setCurrentUser(newUser);
        Alert.alert('Success', 'Account created successfully!');
        return;
      }

      if (authMode === 'LOGIN') {
        if (!password) { Alert.alert('Error', 'Please enter your password.'); return; }
        const response = await fetch(`${SUPABASE_REST_URL}/ludo_users?email=eq.${encodeURIComponent(email)}&limit=1`, { headers: supabaseHeaders });
        const users = await response.json();
        
        if (!Array.isArray(users) || users.length === 0) { Alert.alert('Login Failed', 'No account found with this email.'); return; }
        const cloudUser = users[0];
        
        if (cloudUser.password !== password) { Alert.alert('Login Failed', 'Incorrect password.'); return; }
        const user = { playerId: cloudUser.player_id, name: cloudUser.name || 'Player', email: cloudUser.email, password: cloudUser.password, coins: Number(cloudUser.coins || 0), avatar: cloudUser.avatar || '👤' };

        await AsyncStorage.setItem('@ludo_supreme_user', JSON.stringify(user));
        setCurrentUser(user);
        if (user.avatar) setUserAvatar(user.avatar);
        updateLastSeenCloud(user.playerId);
        Alert.alert('Success', `Welcome back, ${user.name}!`);
      }
    } catch (error) {
      Alert.alert('Error', 'Something went wrong. Please try again.');
    }
  };

  const handleGuestLogin = async () => {
    const guestUser = { playerId: `guest_${Date.now()}`, name: 'Guest Player', email: `guest_${Date.now()}@ludo.app`, coins: 2000, isGuest: true, avatar: '👤' };
    setCurrentUser(guestUser);
    await AsyncStorage.setItem('@ludo_supreme_user', JSON.stringify(guestUser));
    await syncUserToCloud(guestUser);
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem('@ludo_supreme_user');
    setCurrentUser(null);
  };

  const toggleSound = async (val) => {
    setSoundEnabled(val);
    await AsyncStorage.setItem('@ludo_sound_setting', JSON.stringify(val));
  };

  // ==========================================
  // 🎮 GAME ACTIONS
  // ==========================================
  const handleExitGame = () => {
    Alert.alert('Exit Game', 'Return to Main Lobby?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Quit Match', style: 'destructive', onPress: () => {
        setGameMode(null);
        // Add cleanup logic here
      }},
    ]);
  };

  const toggleVoiceMic = async () => {
    setIsMicOn(!isMicOn);
    // Voice toggling logic integrated with Agora
  };

  const sendChatMessage = (textToSend = null) => {
    const msg = (textToSend || chatInputText).trim();
    if (!msg) return;
    const newMsgObj = {
      id: Date.now().toString(), senderName: currentUser?.name,
      senderColor: myColor, avatar: userAvatar,
      text: msg, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setChatMessages(prev => [...prev, newMsgObj]);
    setChatInputText('');
  };

  // ==========================================
  // 🚦 APP ROUTING (CONTROLLER LOGIC)
  // ==========================================

  // 1. If not logged in -> Show Authentication Screen
  if (!currentUser) {
    return (
      <AuthScreen 
        authMode={authMode} setAuthMode={setAuthMode}
        emailInput={emailInput} setEmailInput={setEmailInput}
        passwordInput={passwordInput} setPasswordInput={setPasswordInput}
        newPasswordInput={newPasswordInput} setNewPasswordInput={setNewPasswordInput}
        usernameInput={usernameInput} setUsernameInput={setUsernameInput}
        handleAuthSubmit={handleAuthSubmit} handleGuestLogin={handleGuestLogin}
      />
    );
  }

  // 2. If logged in but not in a match -> Show Dashboard/Lobby
  if (!gameMode) {
    return (
      <DashboardScreen 
        currentUser={currentUser}
        userAvatar={userAvatar}
        setUserAvatar={setUserAvatar}
        soundEnabled={soundEnabled}
        toggleSound={toggleSound}
        handleLogout={handleLogout}
        // Dummy handlers mapped for now to prevent crashes
        loadGlobalLeaderboard={fetchCloudLeaderboard}
        fetchCloudFriendList={() => {}}
        pendingRequests={[]}
        incomingInvitesList={[]}
        setLeaderboardModal={() => {}}
        setProfileStatsModal={() => {}}
        setBotSelectModal={() => { setGameMode('BOT'); }}
        setPassPlayModal={() => { setGameMode('OFFLINE'); }}
        setHybridTeamModal={() => {}}
        setOnlineScreen={() => {}}
        claimDailyBonus={() => {}}
        dailyBonusClaimed={false}
      />
    );
  }

  // 3. If in a match -> Show Game Board
  return (
    <GameScreen 
      handleExitGame={handleExitGame}
      matchPrizePool={matchPrizePool}
      gameMode={gameMode}
      isMicOn={isMicOn}
      toggleVoiceMic={toggleVoiceMic}
      perspective={{ leftColor: 'GREEN', topColor: 'YELLOW', bottomColor: 'RED', rightColor: 'BLUE' }}
      getTurnColorHex={(col) => col === 'RED' ? '#ef4444' : col === 'GREEN' ? '#16a34a' : col === 'YELLOW' ? '#eab308' : '#2563eb'}
      boardRotation="0deg"
      CELL_SIZE={26}
      sendChatMessage={sendChatMessage}
      myColor={myColor}
      chatMessages={chatMessages}
    />
  );
}
