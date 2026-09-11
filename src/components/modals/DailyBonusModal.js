import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';

const DailyBonusModal = ({ visible, onClose, dailyBonusClaimed, claimDailyBonus }) => {
  return (
    <Modal transparent animationType="fade" visible={visible}>
      <View style={styles.inviteModalOverlay}>
        <View style={[styles.glassCard, { borderColor: '#facc15', borderWidth: 2 }]}>
          <Text style={styles.podiumTitleHeader}>🎁 DAILY BONUS</Text>
          <Text style={styles.podiumSubHeader}>Come back every day and collect your reward!</Text>

          <View style={{ marginVertical: 20, alignItems: 'center' }}>
            <Text style={{ fontSize: 52 }}>🪙</Text>
            <Text style={styles.bonusAmountText}>+200 COINS</Text>
          </View>

          <TouchableOpacity activeOpacity={0.85} style={styles.gold3DButton} onPress={claimDailyBonus}>
            <Text style={styles.gold3DButtonText}>
              {dailyBonusClaimed ? 'ALREADY CLAIMED TODAY ✓' : 'CLAIM DAILY BONUS 🎁'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity activeOpacity={0.85} style={[styles.darkSecondaryButton, { marginTop: 10 }]} onPress={onClose}>
            <Text style={styles.darkSecondaryButtonText}>CLOSE</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  inviteModalOverlay: { flex:1, backgroundColor:'rgba(0,0,0,0.85)', justifyContent:'center', alignItems:'center', padding:16 },
  glassCard: { width:'100%', backgroundColor:'#131c31', borderRadius:20, padding:16, borderWidth:1.5, borderColor:'#1e293b' },
  podiumTitleHeader: { color:'#facc15', fontSize:20, fontWeight:'900', textAlign:'center', letterSpacing:1 },
  podiumSubHeader: { color:'#94a3b8', fontSize:12, fontWeight:'700', textAlign:'center', marginBottom:14 },
  bonusAmountText: { color: '#facc15', fontSize: 30, fontWeight: '900', marginTop: 8 },
  gold3DButton: { backgroundColor:'#eab308', borderColor:'#fef08a', borderWidth:1.5, borderRadius:14, paddingVertical:14, alignItems:'center' },
  gold3DButtonText: { color:'#000000', fontSize:14, fontWeight:'900', letterSpacing:1 },
  darkSecondaryButton: { backgroundColor:'#1e293b', borderRadius:14, paddingVertical:12, alignItems:'center', borderWidth:1, borderColor:'#475569' },
  darkSecondaryButtonText: { color:'#cbd5e1', fontSize:13, fontWeight:'700' }
});

export default DailyBonusModal;
