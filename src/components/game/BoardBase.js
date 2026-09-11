import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const BoardBase = ({ color, posStyle, isRanked, inverseRot, CELL_SIZE, getTurnColorHex }) => {
  const pocketPositions = [
    [1.5, 1.5], [1.5, 3.5],
    [3.5, 1.5], [3.5, 3.5]
  ];
  const pocketSize = CELL_SIZE * 0.75; 

  return (
    <View style={[styles.base, posStyle, { width: CELL_SIZE * 6, height: CELL_SIZE * 6 }]}>
      <View style={styles.baseInnerWhite} />
      {pocketPositions.map(([row, col], idx) => {
        const left = col * CELL_SIZE + (CELL_SIZE - pocketSize) / 2;
        const top = row * CELL_SIZE + (CELL_SIZE - pocketSize) / 2;
        return (
          <View
            key={idx}
            style={{
              position: 'absolute', left, top, width: pocketSize, height: pocketSize,
              borderRadius: pocketSize / 2, backgroundColor: getTurnColorHex(color),
              borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.5)', elevation: 3,
              shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 4,
            }}
          />
        );
      })}
      {isRanked !== -1 && (
        <View style={[styles.baseRankBanner, { transform: [{ rotate: inverseRot }] }]}>
          <Text style={styles.baseRankBannerText}>
            {isRanked === 0 ? '🥇 1st' : isRanked === 1 ? '🥈 2nd' : isRanked === 2 ? '🥉 3rd' : '4th'}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  base: { position:'absolute', justifyContent:'center', alignItems:'center', padding:8 },
  baseInnerWhite: { width:'80%', height:'80%', backgroundColor:'#ffffff', borderRadius:6, justifyContent:'space-around', padding:8, borderWidth:1, borderColor:'#cbd5e1' },
  baseRankBanner: { position:'absolute', top:4, backgroundColor:'#78350f', paddingHorizontal:6, paddingVertical:2, borderRadius:6, borderWidth:1, borderColor:'#facc15', zIndex:10 },
  baseRankBannerText: { color:'#fef08a', fontSize:10, fontWeight:'900' }
});

export default BoardBase;
