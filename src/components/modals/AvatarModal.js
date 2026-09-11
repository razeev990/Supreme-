import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { AVATAR_DATA } from '../../constants/gameData';

const AvatarModal = ({ 
  visible, onClose, currentUser, userAvatar, 
  avatarCategory, setAvatarCategory, selectAvatar 
}) => {
  if (!currentUser) return null;

  return (
    <Modal transparent animationType="fade" visible={visible}>
      <View style={styles.inviteModalOverlay}>
        <View style={styles.avatarSelectionCard}>
          <View style={styles.avatarPreviewTopBox}>
            <View style={styles.avatarPreviewCircle}><Text style={{ fontSize: 36 }}>{userAvatar}</Text></View>
            <View style={styles.avatarPreviewNamePlank}>
              <Text style={styles.avatarPreviewNameText}>{currentUser.name}</Text>
            </View>
          </View>
          
          <View style={styles.avatarCategoryRow}>
            <TouchableOpacity style={[styles.avatarTabBtn, avatarCategory === 'MALE' && styles.avatarTabActiveMale]} onPress={() => setAvatarCategory('MALE')}>
              <Text style={styles.avatarTabText}>👦 Male</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.avatarTabBtn, avatarCategory === 'FEMALE' && styles.avatarTabActiveFemale]} onPress={() => setAvatarCategory('FEMALE')}>
              <Text style={styles.avatarTabText}>👧 Female</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.avatarTabBtn, avatarCategory === 'ROYALE' && styles.avatarTabActiveRoyale]} onPress={() => setAvatarCategory('ROYALE')}>
              <Text style={styles.avatarTabText}>👑 Special</Text>
            </TouchableOpacity>
          </View>
          
          <Text style={styles.selectPicHeading}>SELECT PROFILE PICTURE</Text>
          
          <View style={styles.avatarGridContainer}>
            {AVATAR_DATA[avatarCategory].map((item) => {
              const isSelected = userAvatar === item.icon;
              return (
                <TouchableOpacity key={item.id} activeOpacity={0.7} style={[styles.avatarGridTile, isSelected && styles.avatarGridTileSelected]} onPress={() => selectAvatar(item.icon)}>
                  <Text style={{ fontSize: 38 }}>{item.icon}</Text>
                  <Text style={styles.avatarTileLabel} numberOfLines={1}>{item.label}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
          
          <TouchableOpacity activeOpacity={0.85} style={[styles.gold3DButton, { width: '100%', marginTop: 14 }]} onPress={onClose}>
            <Text style={styles.gold3DButtonText}>CONFIRM PICTURE ➔</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  inviteModalOverlay: { flex:1, backgroundColor:'rgba(0,0,0,0.85)', justifyContent:'center', alignItems:'center', padding:16 },
  avatarSelectionCard: { width:'95%', backgroundColor:'#022144', borderRadius:24, padding:14, borderWidth:3, borderColor:'#facc15', alignItems:'center', elevation:12 },
  avatarPreviewTopBox: { flexDirection:'row', alignItems:'center', justifyContent:'center', width:'100%', marginBottom:12 },
  avatarPreviewCircle: { width:56, height:56, borderRadius:28, backgroundColor:'#1e3a8a', borderWidth:2, borderColor:'#38bdf8', justifyContent:'center', alignItems:'center', marginRight:10 },
  avatarPreviewNamePlank: { backgroundColor:'#ffffff', borderWidth:2, borderColor:'#94a3b8', borderStyle:'dashed', borderRadius:10, paddingHorizontal:20, paddingVertical:8, minWidth:150, alignItems:'center' },
  avatarPreviewNameText: { color:'#000000', fontWeight:'900', fontSize:15 },
  avatarCategoryRow: { flexDirection:'row', justifyContent:'space-between', width:'100%', marginBottom:10 },
  avatarTabBtn: { flex:1, backgroundColor:'#0f172a', paddingVertical:8, alignItems:'center', borderRadius:10, marginHorizontal:3, borderWidth:1, borderColor:'#334155' },
  avatarTabActiveMale: { backgroundColor:'#0284c7', borderColor:'#38bdf8' },
  avatarTabActiveFemale: { backgroundColor:'#db2777', borderColor:'#f472b6' },
  avatarTabActiveRoyale: { backgroundColor:'#ca8a04', borderColor:'#facc15' },
  avatarTabText: { color:'#ffffff', fontWeight:'bold', fontSize:12 },
  selectPicHeading: { color:'#facc15', fontSize:16, fontWeight:'900', letterSpacing:1, marginVertical:6 },
  avatarGridContainer: { flexDirection:'row', flexWrap:'wrap', justifyContent:'space-between', width:'100%' },
  avatarGridTile: { width:'31%', height:85, backgroundColor:'#0a192f', borderRadius:12, borderWidth:1.5, borderColor:'#1e3a8a', justifyContent:'center', alignItems:'center', marginVertical:4 },
  avatarGridTileSelected: { borderColor:'#facc15', backgroundColor:'#1e3a8a', borderWidth:2.5, elevation:6 },
  avatarTileLabel: { color:'#94a3b8', fontSize:10, fontWeight:'bold', marginTop:2 },
  gold3DButton: { backgroundColor:'#eab308', borderColor:'#fef08a', borderWidth:1.5, borderRadius:14, paddingVertical:14, alignItems:'center', shadowColor:'#facc15', shadowOpacity:0.4, shadowRadius:8, elevation:6 },
  gold3DButtonText: { color:'#000000', fontSize:14, fontWeight:'900', letterSpacing:1 }
});

export default AvatarModal;
