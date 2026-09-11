import React from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, SafeAreaView, StatusBar } from 'react-native';

const AuthScreen = ({
  authMode, setAuthMode, emailInput, setEmailInput, passwordInput, setPasswordInput,
  newPasswordInput, setNewPasswordInput, usernameInput, setUsernameInput,
  handleAuthSubmit, handleGuestLogin
}) => {
  return (
    <SafeAreaView style={styles.royaleContainer}>
      <StatusBar barStyle="light-content" backgroundColor="#0a0f1d" />
      <View style={styles.brandHero}>
        <Text style={styles.crownEmoji}>👑</Text>
        <Text style={styles.brandGoldTitle}>LUDO SUPREME</Text>
        <View style={styles.goldPillBadge}>
          <Text style={styles.goldPillText}>★ CLOUD AUTH & REALTIME ★</Text>
        </View>
      </View>

      <View style={styles.glassCard}>
        {authMode !== 'FORGOT' ? (
          <View style={styles.tabToggleRow}>
            <TouchableOpacity 
              style={[styles.tabToggleBtn, authMode === 'LOGIN' && styles.tabToggleActive]} 
              onPress={() => setAuthMode('LOGIN')}
            >
              <Text style={[styles.tabToggleText, authMode === 'LOGIN' && styles.tabToggleTextActive]}>Sign In</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.tabToggleBtn, authMode === 'SIGNUP' && styles.tabToggleActive]} 
              onPress={() => setAuthMode('SIGNUP')}
            >
              <Text style={[styles.tabToggleText, authMode === 'SIGNUP' && styles.tabToggleTextActive]}>Create Account</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.forgotHeaderBox}>
            <Text style={styles.forgotTitle}>🔑 Reset Your Password</Text>
            <Text style={styles.forgotSubtitle}>Enter registered email and set a new password</Text>
          </View>
        )}

        {authMode === 'SIGNUP' && (
          <View style={{ marginTop: 12 }}>
            <Text style={styles.inputLabel}>CHOOSE USERNAME</Text>
            <TextInput 
              style={styles.gameTextInput} 
              placeholder="e.g. MasterRajeev" 
              placeholderTextColor="#64748b" 
              value={usernameInput} 
              onChangeText={setUsernameInput} 
            />
          </View>
        )}

        <View style={{ marginTop: 10 }}>
          <Text style={styles.inputLabel}>EMAIL / USER ID</Text>
          <TextInput 
            style={styles.gameTextInput} 
            placeholder="name@gmail.com" 
            placeholderTextColor="#64748b" 
            keyboardType="email-address" 
            autoCapitalize="none" 
            value={emailInput} 
            onChangeText={setEmailInput} 
          />
        </View>

        {authMode !== 'FORGOT' ? (
          <View style={{ marginTop: 10 }}>
            <Text style={styles.inputLabel}>PASSWORD</Text>
            <TextInput 
              style={styles.gameTextInput} 
              placeholder="••••••••" 
              placeholderTextColor="#64748b" 
              secureTextEntry 
              value={passwordInput} 
              onChangeText={setPasswordInput} 
            />
          </View>
        ) : (
          <View style={{ marginTop: 10 }}>
            <Text style={styles.inputLabel}>NEW PASSWORD</Text>
            <TextInput 
              style={styles.gameTextInput} 
              placeholder="Enter new password" 
              placeholderTextColor="#64748b" 
              secureTextEntry 
              value={newPasswordInput} 
              onChangeText={setNewPasswordInput} 
            />
          </View>
        )}

        {authMode === 'LOGIN' && (
          <TouchableOpacity style={styles.forgotLinkContainer} onPress={() => setAuthMode('FORGOT')}>
            <Text style={styles.forgotLinkText}>Forgot Password?</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity activeOpacity={0.85} style={[styles.gold3DButton, { marginTop: 14 }]} onPress={handleAuthSubmit}>
          <Text style={styles.gold3DButtonText}>
            {authMode === 'LOGIN' ? 'LOGIN TO ACCOUNT  ➔' : authMode === 'SIGNUP' ? 'SIGN UP PERMANENTLY  ➔' : 'CONFIRM RESET PASSWORD  ➔'}
          </Text>
        </TouchableOpacity>

        {authMode === 'FORGOT' && (
          <TouchableOpacity activeOpacity={0.85} style={[styles.darkSecondaryButton, { marginTop: 10 }]} onPress={() => setAuthMode('LOGIN')}>
            <Text style={styles.darkSecondaryButtonText}>⬅ Back to Sign In</Text>
          </TouchableOpacity>
        )}

        {authMode !== 'FORGOT' && (
          <>
            <View style={styles.orDivider}>
              <View style={styles.dividerLine} />
              <Text style={styles.orText}>OR</Text>
              <View style={styles.dividerLine} />
            </View>
            <TouchableOpacity activeOpacity={0.85} style={styles.darkSecondaryButton} onPress={handleGuestLogin}>
              <Text style={styles.darkSecondaryButtonText}>⚡ Quick Guest Play</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </SafeAreaView>
  );
};

// Auth specific styles
const styles = StyleSheet.create({
  royaleContainer: { flex:1, backgroundColor:'#0a0f1d', alignItems:'center', justifyContent:'space-between', paddingVertical:14, paddingHorizontal:16 },
  brandHero: { alignItems:'center', marginTop:4 },
  crownEmoji: { fontSize:36, marginBottom:2 },
  brandGoldTitle: { fontSize:24, fontWeight:'900', color:'#facc15', letterSpacing:1.5, textAlign:'center' },
  goldPillBadge: { backgroundColor:'#78350f', borderColor:'#facc15', borderWidth:1, borderRadius:20, paddingHorizontal:12, paddingVertical:3, marginTop:4 },
  goldPillText: { color:'#fef08a', fontSize:10, fontWeight:'800', letterSpacing:1 },
  glassCard: { width:'100%', backgroundColor:'#131c31', borderRadius:20, padding:16, borderWidth:1.5, borderColor:'#1e293b', shadowColor:'#000', shadowOpacity:0.5, shadowRadius:15, elevation:8 },
  tabToggleRow: { flexDirection:'row', backgroundColor:'#0a0f1d', borderRadius:12, padding:4, borderWidth:1, borderColor:'#334155' },
  tabToggleBtn: { flex:1, paddingVertical:10, alignItems:'center', borderRadius:8 },
  tabToggleActive: { backgroundColor:'#0284c7' },
  tabToggleText: { color:'#94a3b8', fontSize:11, fontWeight:'bold' },
  tabToggleTextActive: { color:'#ffffff' },
  forgotHeaderBox: { alignItems:'center', marginBottom:8 },
  forgotTitle: { color:'#facc15', fontSize:16, fontWeight:'bold' },
  forgotSubtitle: { color:'#94a3b8', fontSize:11, textAlign:'center', marginTop:2 },
  inputLabel: { color:'#94a3b8', fontSize:12, fontWeight:'700', marginBottom:6, letterSpacing:0.5 },
  gameTextInput: { backgroundColor:'#0a0f1d', borderWidth:1.5, borderColor:'#334155', borderRadius:12, color:'#ffffff', paddingHorizontal:16, paddingVertical:12, fontSize:15, fontWeight:'600' },
  forgotLinkContainer: { alignSelf:'flex-end', marginTop:8, paddingVertical:4 },
  forgotLinkText: { color:'#38bdf8', fontSize:12, fontWeight:'bold' },
  gold3DButton: { backgroundColor:'#eab308', borderColor:'#fef08a', borderWidth:1.5, borderRadius:14, paddingVertical:14, alignItems:'center', shadowColor:'#facc15', shadowOpacity:0.4, shadowRadius:8, elevation:6 },
  gold3DButtonText: { color:'#000000', fontSize:14, fontWeight:'900', letterSpacing:1 },
  darkSecondaryButton: { backgroundColor:'#1e293b', borderRadius:14, paddingVertical:12, alignItems:'center', borderWidth:1, borderColor:'#475569' },
  darkSecondaryButtonText: { color:'#cbd5e1', fontSize:13, fontWeight:'700' },
  orDivider: { flexDirection:'row', alignItems:'center', marginVertical:12 },
  dividerLine: { flex:1, height:1, backgroundColor:'#334155', marginVertical:6 },
  orText: { color:'#64748b', paddingHorizontal:12, fontSize:11, fontWeight:'bold' }
});

export default AuthScreen;
