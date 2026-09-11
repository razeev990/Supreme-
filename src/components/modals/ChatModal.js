import React from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Modal, KeyboardAvoidingView, Platform, FlatList } from 'react-native';

const QUICK_EMOJIS = ['😀','🔥','😂','👏','🎯','👑','😎','🤫'];

const ChatModal = ({ 
  visible, onClose, chatMessages, chatInputText, setChatInputText, 
  sendChatMessage, myColor, getTurnColorHex 
}) => {
  return (
    <Modal transparent animationType="slide" visible={visible}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.inviteModalOverlay}>
        <View style={[styles.glassCard, styles.chatModalBox]}>
          <View style={styles.chatHeaderRow}>
            <Text style={styles.chatTitleText}>💬 LIVE MATCH CHAT</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeChatBtn}>
              <Text style={styles.closeChatText}>✕</Text>
            </TouchableOpacity>
          </View>
          
          <FlatList
            data={chatMessages}
            keyExtractor={(item) => item.id}
            style={styles.chatListFeed}
            contentContainerStyle={{ paddingVertical: 8 }}
            renderItem={({ item }) => {
              const isMe = item.senderColor === myColor;
              return (
                <View style={[styles.chatBubbleRow, isMe ? styles.chatBubbleRight : styles.chatBubbleLeft]}>
                  <View style={[styles.chatMessageBubble, isMe ? styles.chatBubbleMe : styles.chatBubbleOpponent]}>
                    <Text style={[styles.chatSenderName, { color: getTurnColorHex(item.senderColor) }]}>
                      {item.senderName} ({item.senderColor})
                    </Text>
                    <Text style={styles.chatMessageText}>{item.text}</Text>
                    <Text style={styles.chatTimeText}>{item.time}</Text>
                  </View>
                </View>
              );
            }}
            ListEmptyComponent={<Text style={styles.noChatText}>No messages yet. Send a quick emoji!</Text>}
          />
          
          <View style={styles.quickEmojiRow}>
            {QUICK_EMOJIS.map((emoji, idx) => (
              <TouchableOpacity key={idx} style={styles.emojiCircleBtn} onPress={() => sendChatMessage(emoji)}>
                <Text style={{ fontSize: 20 }}>{emoji}</Text>
              </TouchableOpacity>
            ))}
          </View>
          
          <View style={styles.chatInputWrap}>
            <TextInput 
              style={styles.chatTextInputField} 
              placeholder="Type your message..." 
              placeholderTextColor="#64748b" 
              value={chatInputText} 
              onChangeText={setChatInputText} 
            />
            <TouchableOpacity style={styles.sendChatBtn} onPress={() => sendChatMessage()}>
              <Text style={styles.sendChatBtnText}>Send ➔</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  inviteModalOverlay: { flex:1, backgroundColor:'rgba(0,0,0,0.85)', justifyContent:'center', alignItems:'center', padding:16 },
  glassCard: { width:'100%', backgroundColor:'#131c31', borderRadius:20, padding:16, borderWidth:1.5, borderColor:'#1e293b' },
  chatModalBox: { width:'92%', height:'65%', padding:12, justifyContent:'space-between' },
  chatHeaderRow: { flexDirection:'row', justifyContent:'space-between', alignItems:'center', borderBottomWidth:1, borderBottomColor:'#334155', paddingBottom:8 },
  chatTitleText: { color:'#facc15', fontWeight:'900', fontSize:15 },
  closeChatBtn: { padding:4 },
  closeChatText: { color:'#ffffff', fontSize:16, fontWeight:'bold' },
  chatListFeed: { flex:1, width:'100%' },
  chatBubbleRow: { width:'100%', marginVertical:3, flexDirection:'row' },
  chatBubbleLeft: { justifyContent:'flex-start' },
  chatBubbleRight: { justifyContent:'flex-end' },
  chatMessageBubble: { maxWidth:'78%', paddingHorizontal:10, paddingVertical:6, borderRadius:12 },
  chatBubbleMe: { backgroundColor:'#0284c7' },
  chatBubbleOpponent: { backgroundColor:'#334155' },
  chatSenderName: { fontSize:10, fontWeight:'bold', marginBottom:2 },
  chatMessageText: { color:'#ffffff', fontSize:13, fontWeight:'600' },
  chatTimeText: { color:'#cbd5e1', fontSize:8, alignSelf:'flex-end', marginTop:2 },
  noChatText: { color:'#64748b', textAlign:'center', fontSize:12, marginTop:20 },
  quickEmojiRow: { flexDirection:'row', justifyContent:'space-around', paddingVertical:6, borderTopWidth:1, borderTopColor:'#1e293b' },
  emojiCircleBtn: { padding:4, backgroundColor:'#1e293b', borderRadius:8 },
  chatInputWrap: { flexDirection:'row', alignItems:'center', marginTop:4 },
  chatTextInputField: { flex:1, backgroundColor:'#0a0f1d', borderWidth:1, borderColor:'#334155', borderRadius:10, color:'#ffffff', paddingHorizontal:12, paddingVertical:8, fontSize:13 },
  sendChatBtn: { backgroundColor:'#eab308', borderRadius:10, paddingHorizontal:12, paddingVertical:9, marginLeft:6 },
  sendChatBtnText: { color:'#000000', fontWeight:'900', fontSize:12 }
});

export default ChatModal;
