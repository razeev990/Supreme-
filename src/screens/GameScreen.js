import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, StatusBar, SafeAreaView, StyleSheet } from 'react-native';

// ==========================================
// 📥 IMPORTING GAME UI COMPONENTS & MODALS
// ==========================================
import PlayerCard from '../components/common/PlayerCard';
import BoardBase from '../components/game/BoardBase';
import BoardCell from '../components/game/BoardCell';
import ChatModal from '../components/modals/ChatModal';

const GameScreen = ({
  handleExitGame, matchPrizePool, gameMode, isMicOn, toggleVoiceMic, 
  perspective, getTurnColorHex, boardRotation, CELL_SIZE, 
  sendChatMessage, myColor, chatMessages 
}) => {
  const [chatModal, setChatModal] = useState(false);
  const [chatInputText, setChatInputText] = useState('');

  return (
    <SafeAreaView style={styles.mainContainer}>
      <StatusBar barStyle="light-content" backgroundColor="#0f2b5c" />
      <Image source={require('../../assets/lobby_bg.png')} style={styles.inGameBgCover} resizeMode="cover" blurRadius={12} />
      <View style={styles.inGameBackdropShade} />

      {/* 🚀 LIVE CHAT MODAL */}
      <ChatModal 
        visible={chatModal} 
        onClose={() => setChatModal(false)} 
        chatMessages={chatMessages} 
        chatInputText={chatInputText} 
        setChatInputText={setChatInputText} 
        sendChatMessage={sendChatMessage} 
        myColor={myColor} 
        getTurnColorHex={getTurnColorHex} 
      />

      <View style={styles.headerBar}>
        <TouchableOpacity style={styles.exitBtn} onPress={handleExitGame}>
          <Text style={styles.exitBtnText}>✕ Exit</Text>
        </TouchableOpacity>
        <View style={styles.inGamePoolBox}>
          <Text style={styles.inGamePoolText}>🪙 Pool: {matchPrizePool?.toLocaleString()}</Text>
        </View>
        {(gameMode === 'ONLINE' || gameMode === 'HYBRID') && (
          <View style={styles.onlineGameActions}>
            <TouchableOpacity activeOpacity={0.8} style={[styles.inGameIconBtn, isMicOn ? styles.micBtnActive : styles.micBtnInactive]} onPress={toggleVoiceMic}>
              <Text style={{ fontSize: 16 }}>{isMicOn ? '🎙️' : '🔇'}</Text>
            </TouchableOpacity>
            <TouchableOpacity activeOpacity={0.8} style={[styles.inGameIconBtn, styles.chatTriggerBtn]} onPress={() => setChatModal(true)}>
              <Text style={{ fontSize: 16 }}>💬</Text>
              {chatMessages?.length > 0 && <View style={styles.chatBadgeDot} />}
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* TOP PLAYER CARDS */}
      <View style={styles.topCardsRow}>
        {/* Aapke renderPlayerCard Logic yahan aayenge */}
      </View>

      <View style={styles.boardContainer}>
        <View style={[styles.board, { transform: [{ rotate: boardRotation }] }]}>
          
          {/* LUDO BASES */}
          <BoardBase color="RED" posStyle={styles.redBase} isRanked={-1} CELL_SIZE={CELL_SIZE} getTurnColorHex={getTurnColorHex} inverseRot="90deg" />
          <BoardBase color="GREEN" posStyle={styles.greenBase} isRanked={-1} CELL_SIZE={CELL_SIZE} getTurnColorHex={getTurnColorHex} inverseRot="180deg" />
          <BoardBase color="BLUE" posStyle={styles.blueBase} isRanked={-1} CELL_SIZE={CELL_SIZE} getTurnColorHex={getTurnColorHex} inverseRot="0deg" />
          <BoardBase color="YELLOW" posStyle={styles.yellowBase} isRanked={-1} CELL_SIZE={CELL_SIZE} getTurnColorHex={getTurnColorHex} inverseRot="-90deg" />
          
          <View style={styles.centerHome}>
            <View style={styles.centerTriangleTop} />
            <View style={styles.centerTriangleRight} />
            <View style={styles.centerTriangleBottom} />
            <View style={styles.centerTriangleLeft} />
          </View>

          {/* LUDO CELLS */}
          {Array.from({ length: 15 }).map((_, r) =>
            Array.from({ length: 15 }).map((_, c) => (
              <BoardCell key={`${r}-${c}`} row={r} col={c} CELL_SIZE={CELL_SIZE} inverseRot="0deg" />
            ))
          )}

          {/* PLAYERS TOKENS (Gotis) */}
          {/* renderAllTokens() function yahan call hoga */}

        </View>
      </View>

      {/* BOTTOM PLAYER CARDS */}
      <View style={styles.bottomCardsRow}>
        {/* Aapke renderPlayerCard Logic yahan aayenge */}
      </View>
    </SafeAreaView>
  );
};

// ... Apne purane GameScreen ke styles yahan neeche paste karein ...
const styles = StyleSheet.create({
  mainContainer: { flex:1, backgroundColor:'#0f2b5c', alignItems:'center', justifyContent:'space-between', paddingVertical:10 },
  inGameBgCover: { position:'absolute', top:0, bottom:0, left:0, right:0, width:'100%', height:'100%', opacity:0.38 },
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
  chatTriggerBtn: { backgroundColor:'#0284c7', borderColor:'#38bdf8', position:'relative' },
  chatBadgeDot: { position:'absolute', top:2, right:2, width:8, height:8, borderRadius:4, backgroundColor:'#facc15' },
  topCardsRow: { flexDirection:'row', justifyContent:'space-between', alignItems:'center', width: 350, paddingHorizontal:4, minHeight:60 },
  bottomCardsRow: { flexDirection:'row', justifyContent:'space-between', alignItems:'center', width: 350, paddingHorizontal:4, minHeight:60 },
  boardContainer: { width: 350, height: 350, backgroundColor:'#ffffff', borderWidth:2, borderColor:'#334155', borderRadius:6, overflow:'hidden', elevation:12, shadowColor:'#000', shadowOpacity:0.4, shadowRadius:8 },
  board: { width:'100%', height:'100%', position:'relative', backgroundColor:'#ffffff' },
  redBase: { top:0, left:0, backgroundColor:'#ef4444' },
  greenBase: { top:0, right:0, backgroundColor:'#16a34a' },
  blueBase: { bottom:0, left:0, backgroundColor:'#2563eb' },
  yellowBase: { bottom:0, right:0, backgroundColor:'#eab308' },
  centerHome: { position:'absolute', top: 140, left: 140, width: 70, height: 70, overflow:'hidden' },
  centerTriangleTop: { position:'absolute', top:0, left:0, width:0, height:0, borderLeftWidth:35, borderRightWidth:35, borderTopWidth:35, borderLeftColor:'transparent', borderRightColor:'transparent', borderTopColor:'#16a34a' },
  centerTriangleRight: { position:'absolute', top:0, right:0, width:0, height:0, borderTopWidth:35, borderBottomWidth:35, borderRightWidth:35, borderTopColor:'transparent', borderBottomColor:'transparent', borderRightColor:'#eab308' },
  centerTriangleBottom: { position:'absolute', bottom:0, left:0, width:0, height:0, borderLeftWidth:35, borderRightWidth:35, borderBottomWidth:35, borderLeftColor:'transparent', borderRightColor:'transparent', borderBottomColor:'#2563eb' },
  centerTriangleLeft: { position:'absolute', top:0, left:0, width:0, height:0, borderTopWidth:35, borderBottomWidth:35, borderLeftWidth:35, borderTopColor:'transparent', borderBottomColor:'transparent', borderLeftColor:'#ef4444' }
});

export default GameScreen;
