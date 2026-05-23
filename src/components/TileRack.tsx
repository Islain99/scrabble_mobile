// src/components/TileRack.tsx
// Flow tactile : tap une tuile → elle est "sélectionnée" (surlignée),
// puis tap une case du plateau → elle s'y pose.
// Tap à nouveau sur la tuile sélectionnée → désélectionne.
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { COLORS, FONTS } from '../constants';
import { Tile } from '../types';

interface Props {
  tiles: Tile[];
  playerId: number;
  selectedTile: Tile | null;         // tuile en attente de placement
  onTilePress: (tile: Tile, index: number) => void;
  // mode échange
  isSwapMode: boolean;
  tilesSelectedForSwap: string[];
  onSwapTilePress: (letter: string) => void;
}

export default function TileRack({
  tiles,
  playerId,
  selectedTile,
  onTilePress,
  isSwapMode,
  tilesSelectedForSwap,
  onSwapTilePress,
}: Props) {

  return (
    <View style={styles.wrapper}>
      {/* Étiquette */}
      <View style={styles.labelBadge}>
        <Text style={styles.labelText}>
          {isSwapMode ? 'SÉLECTIONNER POUR ÉCHANGER' : `RACK — JOUEUR ${playerId + 1}`}
        </Text>
      </View>

      {/* Veines bois */}
      {[0.2, 0.4, 0.6, 0.8].map(pct => (
        <View key={pct} style={[styles.grain, { left: `${pct * 100}%` as any }]} />
      ))}

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tilesRow}>
        {tiles.length === 0 ? (
          <Text style={styles.emptyText}>Rack vide</Text>
        ) : (
          tiles.map((tile, index) => {
            const isJoker = tile.letter === '*';
            const isThisSelected = !isSwapMode && selectedTile === tile;
            const isSwapSelected = isSwapMode && tilesSelectedForSwap.includes(tile.letter);

            const getBg = () => {
              if (isThisSelected) return '#FFE080';
              if (isSwapSelected) return '#F5C87A';
              if (isJoker) return '#E8E0CC';
              return COLORS.tileBg;
            };

            const getBorder = () => {
              if (isThisSelected) return '#C8A830';
              if (isSwapSelected) return COLORS.tobacco;
              if (isJoker) return '#B0A080';
              return COLORS.tileBorder;
            };

            return (
              <TouchableOpacity
                key={`${tile.letter}-${index}`}
                activeOpacity={0.7}
                onPress={() => {
                  if (isSwapMode) {
                    onSwapTilePress(tile.letter);
                  } else {
                    onTilePress(tile, index);
                  }
                }}
                style={[
                  styles.tile,
                  {
                    backgroundColor: getBg(),
                    borderColor: getBorder(),
                    transform: [{ translateY: isThisSelected || isSwapSelected ? -6 : 0 }],
                  },
                  isThisSelected && styles.selectedGlow,
                ]}
              >
                <Text style={[styles.letter, { color: isThisSelected ? '#4A2800' : (isJoker ? '#6B5E45' : '#2A1800') }]}>
                  {isJoker ? '★' : tile.letter}
                </Text>
                {tile.score > 0 && (
                  <Text style={[styles.score, { color: isThisSelected ? '#8A5010' : (isJoker ? '#8A7060' : '#6B4010') }]}>
                    {tile.score}
                  </Text>
                )}
                {/* Badge sélection échange */}
                {isSwapSelected && (
                  <View style={styles.checkBadge}>
                    <Text style={styles.checkText}>✓</Text>
                  </View>
                )}
                {/* Indicateur "sélectionnée pour pose" */}
                {isThisSelected && (
                  <View style={styles.selectedIndicator}>
                    <Text style={styles.selectedIndicatorText}>↑</Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          })
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: '#6B4010',
    borderRadius: 4,
    paddingHorizontal: 12,
    paddingTop: 14,
    paddingBottom: 12,
    borderWidth: 3,
    borderColor: COLORS.goldDk,
    shadowColor: '#2A1800',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 5,
    position: 'relative',
    overflow: 'hidden',
    minHeight: 64,
  },
  labelBadge: {
    position: 'absolute',
    top: -1,
    alignSelf: 'center',
    backgroundColor: COLORS.gold,
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
    zIndex: 3,
  },
  labelText: {
    fontFamily: FONTS.dmMono,
    fontSize: 9,
    fontWeight: '500',
    color: '#2A1800',
    letterSpacing: 1.5,
  },
  grain: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 1,
    backgroundColor: 'rgba(255,220,120,0.05)',
    zIndex: 0,
  },
  tilesRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 6,
    paddingTop: 8,
    paddingBottom: 4,
    paddingHorizontal: 4,
  },
  tile: {
    width: 42,
    height: 42,
    borderWidth: 2,
    borderRadius: 3,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.tileShadow,
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
    position: 'relative',
  },
  selectedGlow: {
    shadowColor: COLORS.gold,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 6,
    elevation: 8,
  },
  letter: {
    fontFamily: FONTS.playfair,
    fontSize: 20,
    fontWeight: '700',
    lineHeight: 24,
  },
  score: {
    fontFamily: FONTS.dmMono,
    fontSize: 9,
    position: 'absolute',
    bottom: 2,
    right: 3,
  },
  checkBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: COLORS.tobacco,
    borderWidth: 1,
    borderColor: '#8A5010',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkText: {
    fontSize: 8,
    color: '#FFF0D8',
    fontFamily: FONTS.dmMono,
  },
  selectedIndicator: {
    position: 'absolute',
    top: -4,
    alignSelf: 'center',
  },
  selectedIndicatorText: {
    fontSize: 10,
    color: COLORS.gold,
    fontFamily: FONTS.dmMono,
  },
  emptyText: {
    color: 'rgba(255,220,120,0.35)',
    fontFamily: FONTS.baskervilleItalic,
    fontSize: 14,
    fontStyle: 'italic',
    paddingVertical: 8,
  },
});