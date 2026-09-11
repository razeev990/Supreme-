import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, StatusBar, SafeAreaView, StyleSheet, Modal, FlatList, KeyboardAvoidingView, Platform, Animated } from 'react-native';

// Importing your existing modular components
import BoardBase from '../components/game/BoardBase';
import BoardCell from '../components/game/BoardCell';
import PinToken from '../components/game/PinToken';
import DiceFace from '../components/game/DiceFace';

const BOARD_SIZE = 350; // Standardized for GameScreen
const CELL_SIZE = BOARD_SIZE / 15;

const GameScreen = ({
  // Core Game Props
  myColor, gameMode, matchPrizePool, currentTurn, turnTimeLeft,
  // Player Data & Stats
  roomPlayers, playerSlots, playerMissCount, voiceUsers,
  // Game Logic Props
  pawns, playerDices, activeColors, finishedRankings, 
  hasRolled, isMoving, isRolling, showPodiumBoard,
  // Functions
  handleExitGame, toggleVoiceMic, sendChatMessage, 
  rollDice, executeStepMovement, resetGame,
  // UI & Animations
  perspective, getTurnColorHex, boardRotation, getPawnScreenCoords,
  spinAnim, diceBounceAnim, arrowBounceAnim, arrowBlinkAnim,
  // Chat States
  chatMessages, isMicOn, currentUser, userAvatar
}) => {
  const [chatModal, setChatModal] = useState(false);
  const [chatInputText, setChatInputText] = useState('');

  // 1. Helper to get player names dynamically
  const getBaseDynamicLabel = (color) => {
    if (roomPlayers[color]?.name) return roomPlayers[color].name;
    if (color === myColor) return currentUser?.name || 'You';
    return `Player (${color})`;
  };

  // 2. Render Player Card Logic (Moved from App.js to here)
  const renderPlayerCard = (color, pinHex, isLeftDice = false) => {
    const isPlayable = activeColors.includes(color) && !finishedRankings.includes(color);
    if (!isPlayable) return <View style={styles.playerCardPlaceholder} />;

    const isCurrent = currentTurn === color;
    const slotType = playerSlots[color];
    const misses = playerMissCount[color] || 0;
    const badgeText = gameMode === 'HYBRID' ? (slotType === 'LOCAL' ? '📱 Local' : slotType === 'ONLINE' ? '🌐 Online' : '🤖 Bot') : '';
    const userMicState = voiceUsers[color];
    const playerName = getBaseDynamicLabel(color);

    const spinVal = spinAnim.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '1080deg'],
    });

    return (
      <View style={styles.cardContainerWrapper} key={`card-${color}`}>
        {isCurrent && (
          <Animated.View style={[styles.floatingArrowContainer, styles.arrowTopPos, { transform: [{ translateY: arrowBounceAnim }], opacity: arrowBlinkAnim }]}>
            <View style={styles.arrowIconBubble}><Text style={styles.arrowIconText}>▼</Text></View>
          </Animated.View>
        )}
        <TouchableOpacity activeOpacity={0.8} onPress={() => isCurrent && rollDice()} style={[styles.playerCard, isCurrent && styles.activeCardGlow]}>
          <View style={styles.cardRow}>
            {isLeftDice ? (
              <>
                <Animated.View style={[styles.cardDiceWrap, isCurrent && isRolling && { transform: [{ rotate: spinVal }, { scale: diceBounceAnim }] }]}>
                  <DiceFace value={playerDices[color]} />
                </Animated.View>
                {isCurrent && (
                  <View style={[styles.targetGapTimerBadge, turnTimeLeft <= 10 && styles.timerDangerPulse]}>
                    <Text style={styles.targetGapTimerText}>⏱️ {turnTimeLeft}s</Text>
                  </View>
                )}
                <View style={styles.cardAvatarRight}>
                  <PinToken colorHex={pinHex} stackCount={1} />
                  {userMicState && <Text style={styles.micActiveIndicator}>🎙️</Text>}
                  {misses > 0 && <Text style={styles.missCounterBadge}>⚠️ {misses}/3</Text>}
                  {badgeText !== '' && <Text style={styles.slotSmallBadge}>{badgeText}</Text>}
                </View>
              </>
            ) : (
              <>
                <View style={styles.cardAvatarLeft}>
                  <PinToken colorHex={pinHex} stackCount={1} />
                  {userMicState && <Text style={styles.micActiveIndicator}>🎙️</Text>}
                  {misses > 0 && <Text style={styles.missCounterBadge}>⚠️ {misses}/3</Text>}
                  {badgeText !== '' && <Text style={styles.slotSmallBadge}>{badgeText}</Text>}
                </View>
                {isCurrent && (
                  <View style={[styles.targetGapTimerBadge, turnTimeLeft <= 10 && styles.timerDangerPulse]}>
                    <Text style={styles.targetGapTimerText}>⏱️ {turnTimeLeft}s</Text>
                  </View>
                )}
                <Animated.View style={[styles.cardDiceWrap, isCurrent && isRolling && { transform: [{ rotate: spinVal }, { scale: diceBounceAnim }] }]}>
                  <DiceFace value={playerDices[color]} />
                </Animated.View>
              </>
            )}
          </View>
          <View style={styles.cardNameRow}>
            <Text style={styles.cardPlayerName} numberOfLines={1}>{playerName}</Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  // 3. Render Tokens Logic
  const renderAllTokens = () => {
    const cellGroups = {};
    ['RED', 'GREEN', 'YELLOW', 'BLUE'].forEach((color) => {
      pawns[color]?.forEach((stepCount, idx) => {
        if (stepCount >= 0 && stepCount < 56) {
          const coords = getPawnScreenCoords(color, stepCount, idx);
          const cellKey = `${coords[0].toFixed(1)}_${coords[1].toFixed(1)}`;
          if (!cellGroups[cellKey]) cellGroups[cellKey] = [];
          cellGroups[cellKey].push({ color, idx, stepCount, coords });
        }
      });
    });

    const rendered = [];
    ['RED', 'GREEN', 'YELLOW', 'BLUE'].forEach((color) => {
      pawns[color]?.forEach((stepCount, idx) => {
        const coords = getPawnScreenCoords(color, stepCount, idx);
        const isMyTurn = currentTurn === color;
        const colorHex = getTurnColorHex(color);
        let offsetX = 0, offsetY = 0, stackCount = 1;

        if (stepCount >= 0 && stepCount < 56) {
          const cellKey = `${coords[0].toFixed(1)}_${coords[1].toFixed(1)}`;
          const group = cellGroups[cellKey] || [];
          stackCount = group.length;
          if (stackCount > 1) {
            const idxInGroup = group.findIndex(p => p.color === color && p.idx === idx);
            if (idxInGroup === 0) { offsetX = -4; offsetY = -3; }
            else if (idxInGroup === 1) { offsetX = 5; offsetY = 3; }
            else if (idxInGroup === 2) { offsetX = 0; offsetY = 5; }
            else if (idxInGroup === 3) { offsetX = -4; offsetY = 5; }
          }
        }

        const homeCenterOffset = stepCount === -1 ? CELL_SIZE / 2 : 0;
        const finalLeft = coords[1] * CELL_SIZE - homeCenterOffset + offsetX;
        const finalTop = coords[0] * CELL_SIZE - homeCenterOffset + offsetY;

        rendered.push(
          <TouchableOpacity
            key={`token-${color}-${idx}`}
            disabled={!hasRolled || !isMyTurn || isMoving}
            onPress={() => executeStepMovement(color, idx, playerDices[color])}
            style={[
              styles.tokenWrapper,
              { left: finalLeft, top: finalTop, zIndex: isMyTurn ? 25 : 10 + idx },
              stepCount === 56 && { opacity: 0.3 }
            ]}
          >
            <PinToken colorHex={colorHex} stackCount={stackCount} />
          </TouchableOpacity>
        );
      });
    });
    return rendered;
  };

  return (
    <SafeAreaView style={styles.mainContainer}>
      <StatusBar barStyle="light-content" backgroundColor="#0f2b5c" />
      <View style={styles.inGameBackdropShade} />

      {/* 💬 CHAT MODAL */}
      <Modal transparent animationType="slide" visible={chatModal}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.inviteModalOverlay}>
          <View style={[styles.glassCard, styles.chatModalBox]}>
            <View style={styles.chatHeaderRow}>
              <Text style={styles.chatTitleText}>💬 LIVE MATCH CHAT</Text>
              <TouchableOpacity onPress={() => setChatModal(false)} style={styles.closeChatBtn}><Text style={styles.closeChatText}>✕</Text></TouchableOpacity>
            </View>
            <FlatList
              data={chatMessages}
              keyExtractor={(item) => item.id}
              style={styles.chatListFeed}
              renderItem={({ item }) => {
                const isMe = item.senderColor === myColor;
                return (
                  <View style={[styles.chatBubbleRow, isMe ? styles.chatBubbleRight : styles.chatBubbleLeft]}>
                    <View style={[styles.chatMessageBubble, isMe ? styles.chatBubbleMe : styles.chatBubbleOpponent]}>
                      <Text style={[styles.chatSenderName, { color: getTurnColorHex(item.senderColor) }]}>{item.senderName} ({item.senderColor})</Text>
                      <Text style={styles.chatMessageText}>{item.text}</Text>
                      <Text style={styles.chatTimeText}>{item.time}</Text>
                    </View>
                  </View>
                );
              }}
            />
            <View style={styles.chatInputWrap}>
              <TextInput style={styles.chatTextInputField} placeholder="Type message..." placeholderTextColor="#64748b" value={chatInputText} onChangeText={setChatInputText} />
              <TouchableOpacity style={styles.sendChatBtn} onPress={() => { sendChatMessage(chatInputText); setChatInputText(''); }}><Text style={styles.sendChatBtnText}>Send</Text></TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* 🏆 PODIUM MODAL */}
      {showPodiumBoard && (
        <Modal transparent animationType="slide" visible={showPodiumBoard}>
          <View style={styles.inviteModalOverlay}>
            <View style={[styles.glassCard, { borderColor: '#facc15', borderWidth: 2.5 }]}>
              <Text style={styles.podiumTitleHeader}>🏆 MATCH LEADERBOARD 🏆</Text>
              <View style={styles.leaderboardListWrap}>
                {finishedRankings.map((colorKey, index) => (
                  <View key={colorKey} style={styles.leaderboardRowItem}>
                    <Text style={{ color: '#fff' }}>{index + 1}st: {getBaseDynamicLabel(colorKey)} ({colorKey})</Text>
                  </View>
                ))}
              </View>
              <TouchableOpacity activeOpacity={0.85} style={styles.gold3DButton} onPress={resetGame}>
                <Text style={styles.gold3DButtonText}>COLLECT REWARD & EXIT ➔</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}

      {/* HEADER */}
      <View style={styles.headerBar}>
        <TouchableOpacity style={styles.exitBtn} onPress={handleExitGame}><Text style={styles.exitBtnText}>✕ Exit</Text></TouchableOpacity>
        <View style={styles.inGamePoolBox}><Text style={styles.inGamePoolText}>🪙 Pool: {matchPrizePool?.toLocaleString()}</Text></View>
        <View style={styles.onlineGameActions}>
          <TouchableOpacity style={[styles.inGameIconBtn, isMicOn ? styles.micBtnActive : styles.micBtnInactive]} onPress={toggleVoiceMic}>
            <Text>{isMicOn ? '🎙️' : '🔇'}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.inGameIconBtn, styles.chatTriggerBtn]} onPress={() => setChatModal(true)}>
            <Text>💬</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* TOP PLAYERS */}
      <View style={styles.topCardsRow}>
        {renderPlayerCard(perspective.leftColor, getTurnColorHex(perspective.leftColor), false)}
        {renderPlayerCard(perspective.topColor, getTurnColorHex(perspective.topColor), true)}
      </View>

      {/* LUDO BOARD */}
      <View style={styles.boardContainer}>
        <View style={[styles.board, { transform: [{ rotate: boardRotation }] }]}>
          <BoardBase color="RED" posStyle={styles.redBase} CELL_SIZE={CELL_SIZE} getTurnColorHex={getTurnColorHex} isRanked={finishedRankings.indexOf('RED')} inverseRot="90deg"/>
          <BoardBase color="GREEN" posStyle={styles.greenBase} CELL_SIZE={CELL_SIZE} getTurnColorHex={getTurnColorHex} isRanked={finishedRankings.indexOf('GREEN')} inverseRot="180deg"/>
          <BoardBase color="BLUE" posStyle={styles.blueBase} CELL_SIZE={CELL_SIZE} getTurnColorHex={getTurnColorHex} isRanked={finishedRankings.indexOf('BLUE')} inverseRot="0deg"/>
          <BoardBase color="YELLOW" posStyle={styles.yellowBase} CELL_SIZE={CELL_SIZE} getTurnColorHex={getTurnColorHex} isRanked={finishedRankings.indexOf('YELLOW')} inverseRot="-90deg"/>
          
          <View style={styles.centerHome}>
            <View style={styles.centerTriangleTop} />
            <View style={styles.centerTriangleRight} />
            <View style={styles.centerTriangleBottom} />
            <View style={styles.centerTriangleLeft} />
          </View>
          
          {Array.from({ length: 15 }).map((_, r) =>
            Array.from({ length: 15 }).map((_, c) => <BoardCell key={`${r}-${c}`} row={r} col={c} CELL_SIZE={CELL_SIZE} inverseRot="0deg" />)
          )}
          
          {renderAllTokens()}
        </View>
      </View>

      {/* BOTTOM PLAYERS */}
      <View style={styles.bottomCardsRow}>
        {renderPlayerCard(perspective.bottomColor, getTurnColorHex(perspective.bottomColor), false)}
        {renderPlayerCard(perspective.rightColor, getTurnColorHex(perspective.rightColor), true)}
      </View>
    </SafeAreaView>
  );
};

// Paste ALL your styles here directly from your original monolith App.js
const styles = StyleSheet.create({
  mainContainer: { flex:1, backgroundColor:'#0f2b5c', alignItems:'center', justifyContent:'space-between', paddingVertical:10 },
  inGameBackdropShade: { position:'absolute', top:0, bottom:0, left:0, right:0, backgroundColor:'rgba(15,43,92,0.65)' },
  headerBar: { width:'94%', flexDirection:'row', justifyContent:'space-between', alignItems:'center', marginVertical:4, zIndex:10 },
  exitBtn: { backgroundColor:'#ef4444', paddingHorizontal:12, paddingVertical:6, borderRadius:8, borderWidth:1.5, borderColor:'#ffffff' },
  exitBtnText: { color:'#ffffff', fontWeight:'bold', fontSize:13 },
  inGamePoolBox: { backgroundColor:'#78350f', paddingHorizontal:10, paddingVertical:5, borderRadius:8, borderWidth:1, borderColor:'#facc15' },
  inGamePoolText: { color:'#facc15', fontWeight:'bold', fontSize:12 },
  onlineGameActions: { flexDirection:'row', alignItems:'center' },
  inGameIconBtn: { width:36, height:36, borderRadius:18, justifyContent:'center', alignItems:'center', marginHorizontal:4, borderWidth:1.5 },
  micBtnActive: { backgroundColor:'#10b981', borderColor:'#6ee7b7' },
  micBtnInactive: { backgroundColor:'#334155', borderColor:'#64748b' },
  chatTriggerBtn: { backgroundColor:'#0284c7', borderColor:'#38bdf8' },
  topCardsRow: { flexDirection:'row', justifyContent:'space-between', alignItems:'center', width: 350, paddingHorizontal:4, minHeight:60 },
  bottomCardsRow: { flexDirection:'row', justifyContent:'space-between', alignItems:'center', width: 350, paddingHorizontal:4, minHeight:60 },
  cardContainerWrapper: { width:'46%', alignItems:'center' },
  playerCardPlaceholder: { width:'46%' },
  playerCard: { flexDirection:'column', alignItems:'center', justifyContent:'space-between', backgroundColor:'rgba(15,23,42,0.85)', paddingHorizontal:8, paddingVertical:6, borderRadius:12, borderWidth:1.5, borderColor:'#38bdf8', width:'100%' },
  activeCardGlow: { borderColor:'#facc15', backgroundColor:'rgba(30,58,138,0.9)' },
  cardRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%' },
  cardNameRow: { width: '100%', alignItems: 'center', marginTop: 2, paddingHorizontal: 4 },
  cardPlayerName: { color: '#ffffff', fontSize: 10, fontWeight: 'bold', textAlign: 'center', width: '100%' },
  boardContainer: { width: 350, height: 350, backgroundColor:'#ffffff', borderWidth:2, borderColor:'#334155', borderRadius:6, overflow:'hidden' },
  board: { width:'100%', height:'100%', position:'relative', backgroundColor:'#ffffff' },
  redBase: { position:'absolute', width: 140, height: 140, top:0, left:0, backgroundColor:'#ef4444' },
  greenBase: { position:'absolute', width: 140, height: 140, top:0, right:0, backgroundColor:'#16a34a' },
  blueBase: { position:'absolute', width: 140, height: 140, bottom:0, left:0, backgroundColor:'#2563eb' },
  yellowBase: { position:'absolute', width: 140, height: 140, bottom:0, right:0, backgroundColor:'#eab308' },
  centerHome: { position:'absolute', top: 140, left: 140, width: 70, height: 70 },
  centerTriangleTop: { position:'absolute', top:0, left:0, borderLeftWidth:35, borderRightWidth:35, borderTopWidth:35, borderLeftColor:'transparent', borderRightColor:'transparent', borderTopColor:'#16a34a' },
  centerTriangleRight: { position:'absolute', top:0, right:0, borderTopWidth:35, borderBottomWidth:35, borderRightWidth:35, borderTopColor:'transparent', borderBottomColor:'transparent', borderRightColor:'#eab308' },
  centerTriangleBottom: { position:'absolute', bottom:0, left:0, borderLeftWidth:35, borderRightWidth:35, borderBottomWidth:35, borderLeftColor:'transparent', borderRightColor:'transparent', borderBottomColor:'#2563eb' },
  centerTriangleLeft: { position:'absolute', top:0, left:0, borderTopWidth:35, borderBottomWidth:35, borderLeftWidth:35, borderTopColor:'transparent', borderBottomColor:'transparent', borderLeftColor:'#ef4444' },
  tokenWrapper: { position:'absolute', width:23.33, height:23.33, justifyContent:'center', alignItems:'center' },
  inviteModalOverlay: { flex:1, backgroundColor:'rgba(0,0,0,0.85)', justifyContent:'center', alignItems:'center', padding:16 },
  glassCard: { width:'100%', backgroundColor:'#131c31', borderRadius:20, padding:16 },
  chatModalBox: { height: '60%' },
  chatHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  chatTitleText: { color: '#facc15', fontSize: 16, fontWeight: 'bold' },
  closeChatText: { color: '#fff', fontSize: 16 },
  chatListFeed: { flex: 1 },
  chatBubbleRow: { width: '100%', marginVertical: 4 },
  chatBubbleRight: { alignItems: 'flex-end' },
  chatBubbleLeft: { alignItems: 'flex-start' },
  chatMessageBubble: { padding: 10, borderRadius: 10, maxWidth: '80%' },
  chatBubbleMe: { backgroundColor: '#0284c7' },
  chatBubbleOpponent: { backgroundColor: '#334155' },
  chatMessageText: { color: '#fff' },
  chatInputWrap: { flexDirection: 'row', marginTop: 10 },
  chatTextInputField: { flex: 1, backgroundColor: '#0a0f1d', color: '#fff', padding: 10, borderRadius: 8 },
  sendChatBtn: { backgroundColor: '#eab308', padding: 10, borderRadius: 8, marginLeft: 10 },
  gold3DButton: { backgroundColor: '#eab308', padding: 12, borderRadius: 10, marginTop: 15, alignItems: 'center' },
  gold3DButtonText: { color: '#000', fontWeight: 'bold' }
});

export default GameScreen;
