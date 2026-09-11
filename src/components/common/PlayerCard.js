import React from 'react';
import { View, Text, TouchableOpacity, Animated, StyleSheet } from 'react-native';
import DiceFace from '../game/DiceFace';
import PinToken from '../game/PinToken';

const PlayerCard = ({ 
  color, pinHex, isLeftDice, isPlayable, isCurrent, slotType, misses, 
  badgeText, userMicState, playerName, spinVal, diceBounceAnim, 
  arrowBounceAnim, arrowBlinkAnim, playerDice, turnTimeLeft, isRolling, rollDice 
}) => {
  
  if (!isPlayable) return <View style={styles.playerCardPlaceholder} />;

  return (
    <View style={styles.cardContainerWrapper}>
      {isCurrent && (
        <Animated.View 
          style={[
            styles.floatingArrowContainer, 
            styles.arrowTopPos, 
            { transform: [{ translateY: arrowBounceAnim }], opacity: arrowBlinkAnim }
          ]}
        >
          <View style={styles.arrowIconBubble}><Text style={styles.arrowIconText}>▼</Text></View>
        </Animated.View>
      )}
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => isCurrent && rollDice()}
        style={[styles.playerCard, isCurrent && styles.activeCardGlow]}
      >
        <View style={styles.cardRow}>
          {isLeftDice ? (
            <>
              <Animated.View style={[styles.cardDiceWrap, isCurrent && isRolling && { transform: [{ rotate: spinVal }, { scale: diceBounceAnim }] }]}>
                <DiceFace value={playerDice} />
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
                <DiceFace value={playerDice} />
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

const styles = StyleSheet.create({
  cardContainerWrapper: { width:'46%', alignItems:'center' },
  playerCardPlaceholder: { width:'46%' },
  playerCard: { flexDirection:'column', alignItems:'center', justifyContent:'space-between', backgroundColor:'rgba(15,23,42,0.85)', paddingHorizontal:8, paddingVertical:6, borderRadius:12, borderWidth:1.5, borderColor:'#38bdf8', width:'100%' },
  activeCardGlow: { borderColor:'#facc15', backgroundColor:'rgba(30,58,138,0.9)', elevation:8, shadowColor:'#facc15', shadowOpacity:0.6, shadowRadius:10 },
  cardRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%' },
  cardNameRow: { width: '100%', alignItems: 'center', marginTop: 2, paddingHorizontal: 4 },
  cardPlayerName: { color: '#ffffff', fontSize: 10, fontWeight: 'bold', textAlign: 'center', width: '100%' },
  cardAvatarLeft: { flexDirection:'column', alignItems:'center', width:35 },
  cardAvatarRight: { flexDirection:'column', alignItems:'center', width:35 },
  cardDiceWrap: { padding:2 },
  floatingArrowContainer: { position:'absolute', alignSelf:'center', zIndex:30 },
  arrowTopPos: { top:-24 },
  arrowIconBubble: { backgroundColor:'#f59e0b', paddingHorizontal:8, paddingVertical:2, borderRadius:6, borderWidth:1.5, borderColor:'#ffffff', elevation:6 },
  arrowIconText: { color:'#ffffff', fontWeight:'900', fontSize:14 },
  targetGapTimerBadge: { backgroundColor:'#0f172a', paddingHorizontal:6, paddingVertical:4, borderRadius:8, borderWidth:1.5, borderColor:'#38bdf8', alignItems:'center', justifyContent:'center', marginHorizontal:4 },
  targetGapTimerText: { color:'#ffffff', fontWeight:'900', fontSize:10 },
  timerDangerPulse: { borderColor:'#ef4444', backgroundColor:'#450a0a' },
  micActiveIndicator: { fontSize:10, position:'absolute', top:-4, right:-4 },
  missCounterBadge: { color:'#ef4444', fontSize:9, fontWeight:'900', marginTop:1 },
  slotSmallBadge: { color:'#facc15', fontSize:8, fontWeight:'bold', marginTop:1 }
});

export default PlayerCard;
