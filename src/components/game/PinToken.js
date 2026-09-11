import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const PinToken = ({ colorHex, stackCount }) => (
  <View style={styles.pinWrapper}>
    {stackCount > 1 && (
      <View style={styles.stackBadgeBubble}>
        <Text style={styles.stackBadgeText}>{stackCount}</Text>
      </View>
    )}
    <View style={[styles.pinPedestalRing, { borderColor: colorHex }]}>
      <View style={[styles.pinHeadCircle, { backgroundColor: colorHex }]}>
        <View style={styles.pinWhiteInnerCore}>
          <View style={[styles.pinDotCenter, { backgroundColor: colorHex }]} />
        </View>
      </View>
    </View>
  </View>
);

const styles = StyleSheet.create({
  pinWrapper: { alignItems:'center', width:24, height:32, justifyContent:'center' },
  pinPedestalRing: { width:24, height:24, borderRadius:12, borderWidth:2.5, backgroundColor:'rgba(255,255,255,0.95)', justifyContent:'center', alignItems:'center', elevation:5 },
  pinHeadCircle: { width:15, height:15, borderRadius:7.5, justifyContent:'center', alignItems:'center' },
  pinWhiteInnerCore: { width:8, height:8, borderRadius:4, backgroundColor:'#ffffff', justifyContent:'center', alignItems:'center' },
  pinDotCenter: { width:4, height:4, borderRadius:2 },
  stackBadgeBubble: { position:'absolute', top:-10, alignSelf:'center', backgroundColor:'#facc15', borderRadius:8, width:15, height:15, justifyContent:'center', alignItems:'center', borderWidth:1, borderColor:'#000000', zIndex:30 },
  stackBadgeText: { color:'#000000', fontSize:9, fontWeight:'900' }
});

export default PinToken;
