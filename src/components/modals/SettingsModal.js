import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, ScrollView, Switch } from 'react-native';

const SettingsModal = ({ 
  visible, onClose, currentUser, userAvatar, 
  soundEnabled, toggleSound, setAvatarModal, handleLogout 
}) => {
  if (!currentUser) return null;

  return (
    <Modal transparent animationType="slide" visible={visible}>
      <View style={styles.inviteModalOverlay}>
        <View style={[styles.glassCard, { maxHeight: '90%' }]}>
          <ScrollView contentContainerStyle={{ alignItems: 'center', paddingBottom: 10 }}>
            <Text style={styles.cardHeading}>⚙️ GAME SETTINGS</Text>
            
            <View style={styles.settingsSectionCard}>
              <Text style={styles.settingsSectionTitle}>👤 USER PROFILE</Text>
              <TouchableOpacity activeOpacity={0.8} style={styles.profileBigAvatarWrap} onPress={() => setAvatarModal(true)}>
                <Text style={{ fontSize: 48 }}>{userAvatar}</Text>
                <View style={styles.editAvatarBadge}>
                  <Text style={{ fontSize: 10, color: '#ffffff', fontWeight: 'bold' }}>✏️ Change</Text>
                </View>
              </TouchableOpacity>
              <View style={styles.infoLineRow}>
                <Text style={styles.infoFieldLabel}>Username :</Text>
                <Text style={styles.infoFieldValue}>{currentUser.name}</Text>
              </View>
              <View style={styles.infoLineRow}>
                <Text style={styles.infoFieldLabel}>Gmail ID :</Text>
                <Text style={styles.infoFieldValue} numberOfLines={1}>{currentUser.email}</Text>
              </View>
              <View style={styles.infoLineRow}>
                <Text style={styles.infoFieldLabel}>Player ID :</Text>
                <Text style={styles.infoFieldValue}>#{currentUser.playerId || '9575'}</Text>
              </View>
            </View>
            
            <View style={styles.settingsSectionCard}>
              <Text style={styles.settingsSectionTitle}>🔊 AUDIO SETTINGS</Text>
              <View style={styles.soundToggleRow}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text style={{ fontSize: 22, marginRight: 8 }}>{soundEnabled ? '🔊' : '🔇'}</Text>
                  <Text style={styles.soundLabelText}>Game Sounds & FX</Text>
                </View>
                <Switch 
                  trackColor={{ false: '#475569', true: '#10b981' }} 
                  thumbColor={soundEnabled ? '#ffffff' : '#94a3b8'} 
                  onValueChange={toggleSound} 
                  value={soundEnabled} 
                />
              </View>
            </View>
            
            <View style={styles.settingsSectionCard}>
              <Text style={styles.settingsSectionTitle}>ℹ️ ABOUT GAME</Text>
              <Text style={styles.aboutGoldTitle}>LUDO SUPREME 3D</Text>
              <Text style={styles.aboutVersionText}>Version: 1.0.0 (Royale Edition)</Text>
              <View style={styles.dividerLine} />
              <Text style={styles.aboutCreatorText}>App created by Rajeev Kumar sah</Text>
              <Text style={styles.aboutContactText}>Gmail - razeevsah@gmail.com</Text>
            </View>
            
            <TouchableOpacity activeOpacity={0.85} style={styles.logoutSettingsBtn} onPress={handleLogout}>
              <Text style={styles.logoutSettingsText}>🚪 LOGOUT ACCOUNT</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={[styles.gold3DButton, { width: '100%', marginTop: 8 }]} onPress={onClose}>
              <Text style={styles.gold3DButtonText}>SAVE & CLOSE</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  inviteModalOverlay: { flex:1, backgroundColor:'rgba(0,0,0,0.85)', justifyContent:'center', alignItems:'center', padding:16 },
  glassCard: { width:'100%', backgroundColor:'#131c31', borderRadius:20, padding:16, borderWidth:1.5, borderColor:'#1e293b' },
  cardHeading: { fontSize:18, fontWeight:'bold', color:'#ffffff', textAlign:'center', marginBottom:14, letterSpacing:1 },
  settingsSectionCard: { width:'100%', backgroundColor:'#0a0f1d', borderRadius:14, padding:12, borderWidth:1, borderColor:'#334155', marginVertical:6, alignItems:'center' },
  settingsSectionTitle: { color:'#38bdf8', fontSize:12, fontWeight:'900', letterSpacing:1, marginBottom:8, alignSelf:'flex-start' },
  profileBigAvatarWrap: { width:75, height:75, borderRadius:38, backgroundColor:'#1e293b', justifyContent:'center', alignItems:'center', borderWidth:2.5, borderColor:'#facc15', marginVertical:6, position:'relative' },
  editAvatarBadge: { position:'absolute', bottom:-4, backgroundColor:'#0284c7', paddingHorizontal:6, paddingVertical:1, borderRadius:6, borderWidth:1, borderColor:'#ffffff' },
  infoLineRow: { flexDirection:'row', justifyContent:'space-between', width:'100%', paddingVertical:5, borderBottomWidth:0.5, borderBottomColor:'#1e293b' },
  infoFieldLabel: { color:'#94a3b8', fontSize:12, fontWeight:'bold' },
  infoFieldValue: { color:'#ffffff', fontSize:12, fontWeight:'bold', maxWidth:170 },
  soundToggleRow: { flexDirection:'row', justifyContent:'space-between', alignItems:'center', width:'100%', paddingVertical:4 },
  soundLabelText: { color:'#ffffff', fontSize:13, fontWeight:'bold' },
  aboutGoldTitle: { color:'#facc15', fontSize:16, fontWeight:'900', marginTop:2 },
  aboutVersionText: { color:'#94a3b8', fontSize:11, marginBottom:6 },
  aboutCreatorText: { color:'#ffffff', fontSize:12, fontWeight:'700' },
  aboutContactText: { color:'#38bdf8', fontSize:12, fontWeight:'600', marginTop:2 },
  dividerLine: { width: '100%', height:1, backgroundColor:'#334155', marginVertical:6 },
  logoutSettingsBtn: { width:'100%', backgroundColor:'#ef4444', borderRadius:12, paddingVertical:12, alignItems:'center', marginTop:10, borderWidth:1, borderColor:'#fca5a5' },
  logoutSettingsText: { color:'#ffffff', fontWeight:'900', fontSize:13, letterSpacing:0.5 },
  gold3DButton: { backgroundColor:'#eab308', borderColor:'#fef08a', borderWidth:1.5, borderRadius:14, paddingVertical:14, alignItems:'center' },
  gold3DButtonText: { color:'#000000', fontSize:14, fontWeight:'900', letterSpacing:1 }
});

export default SettingsModal;
