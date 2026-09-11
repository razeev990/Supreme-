import React from 'react';
import { View, Text, TouchableOpacity, Image, StatusBar, SafeAreaView, StyleSheet } from 'react-native';

const DashboardScreen = ({
  currentUser, loadGlobalLeaderboard, setLeaderboardModal, 
  setFriendsModal, fetchCloudFriendList, pendingRequests, incomingInvitesList, 
  setSettingsModal, setDailyBonusModal, setProfileStatsModal, 
  setBotSelectModal, setPassPlayModal, setHybridTeamModal, setOnlineScreen
}) => {
  return (
    <View style={styles.dashboardContainer}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <Image source={require('../../assets/lobby_bg.png')} style={styles.lobbyBgImage} resizeMode="cover" />
      
      <SafeAreaView style={styles.fulfilledTopActionCenterBar}>
        <View style={styles.topActionCenterInnerRow}>
          <TouchableOpacity activeOpacity={0.85} style={styles.megaFulfilledButton} onPress={() => { loadGlobalLeaderboard(); setLeaderboardModal(true); }}>
            <Text style={styles.megaFulfilledEmoji}>🏆</Text><Text style={styles.megaFulfilledText}>Leaderboard</Text>
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={0.85} style={styles.megaFulfilledButton} onPress={() => { setFriendsModal(true); fetchCloudFriendList(currentUser?.playerId); }}>
            <Text style={styles.megaFulfilledEmoji}>👥</Text><Text style={styles.megaFulfilledText}>Friends Squad</Text>
            {(pendingRequests.length > 0 || incomingInvitesList.length > 0) && (
              <View style={styles.friendNotificationBadge}><Text style={styles.friendNotificationBadgeText}>{pendingRequests.length + incomingInvitesList.length}</Text></View>
            )}
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={0.85} style={styles.megaFulfilledButton} onPress={() => setSettingsModal(true)}>
            <Text style={styles.megaFulfilledEmoji}>⚙️</Text><Text style={styles.megaFulfilledText}>Settings</Text>
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={0.85} style={styles.megaFulfilledButton} onPress={() => setDailyBonusModal(true)}>
            <Text style={styles.megaFulfilledEmoji}>🎁</Text><Text style={styles.megaFulfilledText}>Daily Bonus</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
      
      <View style={styles.centerBannerProfileWrapPerfect}>
        <TouchableOpacity activeOpacity={0.85} onPress={() => setProfileStatsModal(true)} style={styles.centerCrownPosition}>
          <Text style={{ fontSize: 30 }}>👑</Text>
        </TouchableOpacity>
        <TouchableOpacity activeOpacity={0.85} onPress={() => setProfileStatsModal(true)} style={styles.centerBannerContainerPerfect}>
          <Text style={styles.centerBannerUsername} numberOfLines={1}>{currentUser.name}</Text>
          <View style={styles.centerBannerCoinsRow}>
            <Text style={{ fontSize: 13, marginRight: 4 }}>🪙</Text>
            <Text style={styles.centerBannerCoinsText}>{currentUser.coins.toLocaleString()} Coins</Text>
          </View>
          <Text style={styles.viewProfileSubHint}>Tap to view stats</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.podiumTouchLayer}>
        <TouchableOpacity activeOpacity={0.4} style={styles.podiumTouchSpot} onPress={() => setBotSelectModal(true)} />
        <TouchableOpacity activeOpacity={0.4} style={styles.podiumTouchSpot} onPress={() => setPassPlayModal(true)} />
        <TouchableOpacity activeOpacity={0.4} style={styles.podiumTouchSpot} onPress={() => setHybridTeamModal(true)} />
        <TouchableOpacity activeOpacity={0.4} style={styles.podiumTouchSpot} onPress={() => setOnlineScreen(true)} />
      </View>
    </View>
  );
};

// Paste Dashboard specific styles here from your original App.js
const styles = StyleSheet.create({
  dashboardContainer: { flex:1, backgroundColor:'#0a0f1d', width:'100%', height:'100%' },
  lobbyBgImage: { width:'100%', height:'100%', position:'absolute', top:0, left:0, right:0, bottom:0 },
  fulfilledTopActionCenterBar: { width:'100%', alignItems:'center', paddingTop:22, zIndex:30 },
  topActionCenterInnerRow: { width:'90%', flexDirection:'row', justifyContent:'space-between', backgroundColor:'rgba(15,23,42,0.88)', borderWidth:1.5, borderColor:'#facc15', borderRadius:16, paddingVertical:8, paddingHorizontal:10, elevation:8 },
  megaFulfilledButton: { flex:1, alignItems:'center', justifyContent:'center', backgroundColor:'#1e293b', marginHorizontal:4, paddingVertical:6, borderRadius:10, borderWidth:1, borderColor:'#334155', position:'relative' },
  megaFulfilledEmoji: { fontSize:18, marginBottom:1 },
  megaFulfilledText: { color:'#ffffff', fontSize:10, fontWeight:'900', textAlign:'center' },
  friendNotificationBadge: { position:'absolute', top:-4, right:2, backgroundColor:'#ef4444', minWidth:16, height:16, borderRadius:8, justifyContent:'center', alignItems:'center', borderWidth:1.5, borderColor:'#ffffff', paddingHorizontal:2, elevation:6 },
  friendNotificationBadgeText: { color:'#ffffff', fontSize:9, fontWeight:'900' },
  centerBannerProfileWrapPerfect: { width:'100%', alignItems:'center', marginTop:12, zIndex:15 },
  centerCrownPosition: { marginBottom:-13, zIndex:5, alignItems:'center' },
  centerBannerContainerPerfect: { width:'78%', backgroundColor:'rgba(20,30,50,0.95)', borderWidth:2, borderColor:'#facc15', borderRadius:16, paddingVertical:6, paddingHorizontal:12, alignItems:'center', shadowColor:'#facc15', shadowOpacity:0.5, shadowRadius:8, elevation:8 },
  centerBannerUsername: { color:'#ffffff', fontSize:15, fontWeight:'900', letterSpacing:0.5, textAlign:'center', maxWidth:'100%' },
  centerBannerCoinsRow: { flexDirection:'row', alignItems:'center', marginTop:2, justifyContent:'center' },
  centerBannerCoinsText: { color:'#facc15', fontSize:13, fontWeight:'800' },
  viewProfileSubHint: { color:'#38bdf8', fontSize:9, fontWeight:'bold', marginTop:2, letterSpacing:0.5 },
  podiumTouchLayer: { position:'absolute', top:'38%', left:'4%', right:'4%', height:360, flexDirection:'row', flexWrap:'wrap', justifyContent:'space-between', alignContent:'space-between', zIndex:20 },
  podiumTouchSpot: { width:'47%', height:165, borderRadius:24 }
});

export default DashboardScreen;
