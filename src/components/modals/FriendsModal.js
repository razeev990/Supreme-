import React from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Modal, ScrollView, ActivityIndicator } from 'react-native';

const FriendsModal = ({
  visible, onClose, currentUser, friendsTab, setFriendsTab,
  friendsList, recentPlayersList, pendingRequests, incomingInvitesList,
  searchQuery, setSearchQuery, handleSearchUser, isSearchingCloud, searchedUserResult,
  sendRealtimeFriendRequest, sendFriendInvite, acceptFriendRequest, acceptInvite,
  copyMyPlayerId, fetchCloudFriendList
}) => {
  return (
    <Modal transparent animationType="slide" visible={visible}>
      <View style={styles.inviteModalOverlay}>
        <View style={[styles.glassCard, { maxHeight: '92%', padding: 14 }]}>
          
          <View style={styles.squadTopHeaderRow}>
            <View>
              <Text style={styles.squadMainTitle}>👥 FRIENDS SQUAD</Text>
              <Text style={styles.squadSubTitle}>Play, Connect & Send Invites</Text>
            </View>
            <TouchableOpacity style={styles.squadCloseCrossBtn} onPress={onClose}>
              <Text style={styles.squadCloseCrossText}>✕</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.myIdPlankBar}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={{ fontSize: 18, marginRight: 6 }}>🪪</Text>
              <Text style={styles.myIdPlankText}>
                Your ID: <Text style={{ color: '#facc15', fontWeight: '900' }}>#{currentUser?.playerId || '9575'}</Text>
              </Text>
            </View>
            <TouchableOpacity style={styles.copyIdPillBtn} onPress={copyMyPlayerId}>
              <Text style={styles.copyIdPillText}>📋 Copy</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.topSquadSearchRow}>
            <TextInput 
              style={styles.topSquadSearchInput} 
              placeholder="Search by Player ID or Email..." 
              placeholderTextColor="#64748b" 
              autoCapitalize="none" 
              value={searchQuery} 
              onChangeText={setSearchQuery} 
            />
            <TouchableOpacity style={styles.topSquadSearchBtn} onPress={handleSearchUser}>
              {isSearchingCloud ? <ActivityIndicator color="#000000" size="small" /> : <Text style={styles.topSquadSearchBtnText}>🔍 Search</Text>}
            </TouchableOpacity>
          </View>

          {searchedUserResult && (
            <View style={styles.searchedPlayerCardBox}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={{ fontSize: 24, marginRight: 8 }}>{searchedUserResult.avatar}</Text>
                <View>
                  <Text style={styles.friendCardNameText}>{searchedUserResult.name}</Text>
                  <Text style={styles.friendCardSubText}>ID: #{searchedUserResult.playerId}</Text>
                </View>
              </View>
              <TouchableOpacity style={styles.addFriendActionBtn} onPress={() => sendRealtimeFriendRequest(searchedUserResult)}>
                <Text style={styles.addFriendActionText}>+ Add Friend</Text>
              </TouchableOpacity>
            </View>
          )}

          <View style={styles.cleanTabsRow}>
            <TouchableOpacity style={[styles.cleanTabPill, friendsTab === 'LIST' && styles.cleanTabPillActive]} onPress={() => { setFriendsTab('LIST'); fetchCloudFriendList(currentUser?.playerId); }}>
              <Text style={[styles.cleanTabText, friendsTab === 'LIST' && styles.cleanTabTextActive]}>👥 Friends ({friendsList.length})</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.cleanTabPill, friendsTab === 'RECENT' && styles.cleanTabPillActive]} onPress={() => setFriendsTab('RECENT')}>
              <Text style={[styles.cleanTabText, friendsTab === 'RECENT' && styles.cleanTabTextActive]}>🕒 Recent ({recentPlayersList.length})</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.cleanTabPill, friendsTab === 'INVITES' && styles.cleanTabPillActive]} onPress={() => setFriendsTab('INVITES')}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={[styles.cleanTabText, friendsTab === 'INVITES' && styles.cleanTabTextActive]}>🎮 Invites</Text>
                {incomingInvitesList.length > 0 && <View style={styles.tabRedDotIndicator} />}
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.cleanTabPill, friendsTab === 'REQUESTS' && styles.cleanTabPillActive]} onPress={() => setFriendsTab('REQUESTS')}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={[styles.cleanTabText, friendsTab === 'REQUESTS' && styles.cleanTabTextActive]}>📩 Reqs</Text>
                {pendingRequests.length > 0 && <View style={styles.tabRedDotIndicator} />}
              </View>
            </TouchableOpacity>
          </View>

          {/* 
            TAB CONTENT RENDERING
          */}
          <ScrollView style={styles.squadTabScrollFeed}>
            {friendsTab === 'LIST' && (
              friendsList.length === 0 ? <Text style={styles.squadEmptyStateText}>No friends added yet. Type an ID in search box to add friends!</Text> :
              friendsList.map((friend) => (
                <View key={friend.id} style={styles.friendItemCardWrap}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View style={styles.avatarWithRingBox}>
                      <Text style={{ fontSize: 24 }}>{friend.avatar || '👤'}</Text>
                      <View style={[styles.onlineIndicatorDot, { backgroundColor: friend.online ? '#10b981' : '#64748b' }]} />
                    </View>
                    <View style={{ marginLeft: 10 }}>
                      <Text style={styles.friendCardNameText}>{friend.name}</Text>
                      <Text style={styles.friendCardSubText}>ID: #{friend.id} • {friend.online ? 'Online' : 'Offline'}</Text>
                    </View>
                  </View>
                  <TouchableOpacity style={[styles.inviteFriendActionBtn, friend.isInvited && { backgroundColor: '#475569' }]} disabled={friend.isInvited} onPress={() => sendFriendInvite(friend)}>
                    <Text style={styles.inviteFriendActionText}>{friend.isInvited ? '✓ Invited' : '🎮 Invite'}</Text>
                  </TouchableOpacity>
                </View>
              ))
            )}

            {friendsTab === 'RECENT' && (
              recentPlayersList.length === 0 ? <Text style={styles.squadEmptyStateText}>No recent players yet. Play online matches to see players here!</Text> :
              recentPlayersList.map((player) => {
                const isAlreadyFriend = friendsList.some(f => f.id === player.id);
                return (
                  <View key={player.id} style={styles.friendItemCardWrap}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <Text style={{ fontSize: 24, marginRight: 8 }}>{player.avatar || '👤'}</Text>
                      <View><Text style={styles.friendCardNameText}>{player.name}</Text><Text style={styles.friendCardSubText}>Played: {player.playedAt}</Text></View>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      {!isAlreadyFriend && (
                        <TouchableOpacity style={[styles.inviteFriendActionBtn, { backgroundColor: '#3b82f6', marginRight: 6 }]} onPress={() => sendRealtimeFriendRequest(player)}>
                          <Text style={styles.inviteFriendActionText}>+ Friend</Text>
                        </TouchableOpacity>
                      )}
                      <TouchableOpacity style={styles.inviteFriendActionBtn} onPress={() => sendFriendInvite(player)}>
                        <Text style={styles.inviteFriendActionText}>🎮 Invite</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                );
              })
            )}

            {friendsTab === 'INVITES' && (
              incomingInvitesList.length === 0 ? <Text style={styles.squadEmptyStateText}>No match invites right now.</Text> :
              incomingInvitesList.map((inv) => (
                <View key={inv.id} style={styles.friendItemCardWrap}>
                  <View><Text style={styles.friendCardNameText}>🎮 {inv.from_name}</Text><Text style={styles.friendCardSubText}>Room: #{inv.room_code} • Fee: 🪙 {inv.entry_fee}</Text></View>
                  <TouchableOpacity style={[styles.inviteFriendActionBtn, { backgroundColor: '#eab308' }]} onPress={() => acceptInvite({
                    inviteRowId: inv.id, fromName: inv.from_name, fromId: inv.from_id,
                    roomCode: inv.room_code, playType: inv.play_type, entryFee: inv.entry_fee, targetColor: 'GREEN'
                  })}>
                    <Text style={[styles.inviteFriendActionText, { color: '#000000' }]}>✓ Join Match</Text>
                  </TouchableOpacity>
                </View>
              ))
            )}

            {friendsTab === 'REQUESTS' && (
              pendingRequests.length === 0 ? <Text style={styles.squadEmptyStateText}>No pending friend requests.</Text> :
              pendingRequests.map((req) => (
                <View key={req.id} style={styles.friendItemCardWrap}>
                  <View><Text style={styles.friendCardNameText}>{req.from_name || 'Player'}</Text><Text style={styles.friendCardSubText}>Sent you a friend request</Text></View>
                  <TouchableOpacity style={[styles.inviteFriendActionBtn, { backgroundColor: '#10b981' }]} onPress={() => acceptFriendRequest(req)}>
                    <Text style={styles.inviteFriendActionText}>✓ Accept</Text>
                  </TouchableOpacity>
                </View>
              ))
            )}
          </ScrollView>
          
          <TouchableOpacity activeOpacity={0.85} style={[styles.darkSecondaryButton, { marginTop: 10, width: '100%' }]} onPress={onClose}>
            <Text style={styles.darkSecondaryButtonText}>Close Squad</Text>
          </TouchableOpacity>
          
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  inviteModalOverlay: { flex:1, backgroundColor:'rgba(0,0,0,0.85)', justifyContent:'center', alignItems:'center', padding:16 },
  glassCard: { width:'100%', backgroundColor:'#131c31', borderRadius:20, padding:16, borderWidth:1.5, borderColor:'#1e293b' },
  squadTopHeaderRow: { flexDirection:'row', justifyContent:'space-between', alignItems:'center', width:'100%', borderBottomWidth:1, borderBottomColor:'#1e293b', paddingBottom:8 },
  squadMainTitle: { color:'#facc15', fontSize:18, fontWeight:'900', letterSpacing:1 },
  squadSubTitle: { color:'#94a3b8', fontSize:11, fontWeight:'600', marginTop:1 },
  squadCloseCrossBtn: { padding:6, backgroundColor:'#1e293b', borderRadius:14, borderWidth:1, borderColor:'#334155' },
  squadCloseCrossText: { color:'#ffffff', fontSize:13, fontWeight:'bold' },
  myIdPlankBar: { flexDirection:'row', justifyContent:'space-between', alignItems:'center', width:'100%', backgroundColor:'#0a192f', paddingHorizontal:12, paddingVertical:8, borderRadius:10, borderWidth:1, borderColor:'#38bdf8', marginTop:10 },
  myIdPlankText: { color:'#ffffff', fontSize:13, fontWeight:'700' },
  copyIdPillBtn: { backgroundColor:'#0284c7', paddingHorizontal:10, paddingVertical:4, borderRadius:6 },
  copyIdPillText: { color:'#ffffff', fontWeight:'bold', fontSize:11 },
  topSquadSearchRow: { flexDirection:'row', width:'100%', marginTop:8 },
  topSquadSearchInput: { flex:1, backgroundColor:'#0a0f1d', borderWidth:1, borderColor:'#334155', borderRadius:10, color:'#ffffff', paddingHorizontal:12, paddingVertical:8, fontSize:12 },
  topSquadSearchBtn: { backgroundColor:'#eab308', borderRadius:10, paddingHorizontal:14, justifyContent:'center', alignItems:'center', marginLeft:6 },
  topSquadSearchBtnText: { color:'#000000', fontWeight:'900', fontSize:12 },
  searchedPlayerCardBox: { flexDirection:'row', justifyContent:'space-between', alignItems:'center', width:'100%', backgroundColor:'#0a0f1d', padding:10, borderRadius:12, marginTop:8, borderWidth:1.5, borderColor:'#facc15' },
  addFriendActionBtn: { backgroundColor:'#10b981', paddingHorizontal:12, paddingVertical:6, borderRadius:8 },
  addFriendActionText: { color:'#ffffff', fontWeight:'900', fontSize:11 },
  cleanTabsRow: { flexDirection:'row', justifyContent:'space-between', width:'100%', marginTop:10, backgroundColor:'#0a0f1d', padding:3, borderRadius:10, borderWidth:1, borderColor:'#334155' },
  cleanTabPill: { flex:1, paddingVertical:7, alignItems:'center', borderRadius:8 },
  cleanTabPillActive: { backgroundColor:'#0284c7' },
  cleanTabText: { color:'#94a3b8', fontSize:10, fontWeight:'700' },
  cleanTabTextActive: { color:'#ffffff', fontWeight:'900' },
  tabRedDotIndicator: { width:7, height:7, borderRadius:3.5, backgroundColor:'#ef4444', marginLeft:4 },
  squadTabScrollFeed: { maxHeight:220, width:'100%', marginTop:8 },
  squadEmptyStateText: { color:'#94a3b8', textAlign:'center', fontSize:12, marginTop:24, paddingHorizontal:16 },
  friendItemCardWrap: { flexDirection:'row', justifyContent:'space-between', alignItems:'center', backgroundColor:'#0a0f1d', padding:10, borderRadius:12, marginVertical:4, borderWidth:1, borderColor:'#1e293b' },
  avatarWithRingBox: { position:'relative', width:34, height:34, borderRadius:17, backgroundColor:'#1e293b', justifyContent:'center', alignItems:'center', borderWidth:1.5, borderColor:'#38bdf8' },
  onlineIndicatorDot: { position:'absolute', bottom:-2, right:-2, width:9, height:9, borderRadius:4.5, borderWidth:1.5, borderColor:'#0a0f1d' },
  friendCardNameText: { color:'#ffffff', fontWeight:'bold', fontSize:13 },
  friendCardSubText: { color:'#94a3b8', fontSize:10, marginTop:1 },
  inviteFriendActionBtn: { backgroundColor:'#10b981', paddingHorizontal:12, paddingVertical:6, borderRadius:8 },
  inviteFriendActionText: { color:'#ffffff', fontWeight:'bold', fontSize:11 },
  darkSecondaryButton: { backgroundColor:'#1e293b', borderRadius:14, paddingVertical:12, alignItems:'center', borderWidth:1, borderColor:'#475569' },
  darkSecondaryButtonText: { color:'#cbd5e1', fontSize:13, fontWeight:'700' }
});

export default FriendsModal;
