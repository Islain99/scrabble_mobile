// src/components/Board.tsx
// Le plateau 15x15 avec placement par tap (pas DnD — voir TileRack pour le flow).
// Flow tactile : tap sur une tuile du rack la "sélectionne", puis tap sur une case vide la pose.
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { COLORS, FONTS } from '../constants';
import { GameState, Placement, Tile } from '../types';

const SCREEN_W = Dimensions.get('window').width;
// Plateau = largeur écran moins padding latéral (16*2) et bordures
const BOARD_SIZE = SCREEN_W - 32;
const CELL_SIZE = Math.floor((BOARD_SIZE - 24) / 15); // 24 = padding interne board

const BONUS_COLORS: Record<string, { bg: string; label: string; text: string }> = {
  TM:    { bg: '#8B2020', label: '3M', text: '#F5D0C0' },
  DM:    { bg: '#C8803A', label: '2M', text: '#FFF0D8' },
  TL:    { bg: '#1A4A8A', label: '3L', text: '#C8DCFF' },
  DL:    { bg: '#3A7EB8', label: '2L', text: '#DCEEFF' },
  START: { bg: '#8B4A20', label: '★',  text: '#FFE8C0' },
};

const getBonus = (r: number, c: number): string | null => {
  if (r === 7 && c === 7) return 'START';
  if ([0,7,14].includes(r) && [0,7,14].includes(c)) return 'TM';
  if ((r === c || r + c === 14) && [1,2,3,4,10,11,12,13].includes(r) && r !== 7 && c !== 7) return 'DM';
  if (([1,13].includes(r) && [5,9].includes(c)) || ([5,9].includes(r) && [1,5,9,13].includes(c))) return 'TL';
  if (
    ([0,14].includes(r) && [3,11].includes(c)) ||
    ([2,12].includes(r) && [6,8].includes(c)) ||
    ([3,11].includes(r) && [0,7,14].includes(c)) ||
    ([6,8].includes(r) && [2,6,8,12].includes(c)) ||
    (r === 7 && [3,11].includes(c))
  ) return 'DL';
  return null;
};

interface Props {
  gameState: GameState;
  placements: Placement[];
  selectedRackTile: Tile | null; // tuile sélectionnée dans le rack, prête à être posée
  onCellPress: (r: number, c: number) => void; // tap sur une case vide
  onTempTilePress: (r: number, c: number) => void; // tap sur une tuile temporaire = retour rack
}

export default function Board({
  gameState,
  placements,
  selectedRackTile,
  onCellPress,
  onTempTilePress,
}: Props) {
  const grid = gameState.board.grid;

  // Map des tuiles temporaires pour lookup rapide
  const tempMap: Record<string, Placement> = {};
  placements.forEach(p => { tempMap[`${p.r}-${p.c}`] = p; });

  // Grille fusionnée
  const mergedGrid = grid.map((row, r) =>
    row.map((cell, c) => {
      const temp = tempMap[`${r}-${c}`];
      return temp ? { tile: temp.originalTile, isTemp: true } : { tile: cell, isTemp: false };
    })
  );

  const fontSize = CELL_SIZE * 0.42;
  const scoreFontSize = CELL_SIZE * 0.22;

  return (
    <View style={styles.boardWrapper}>
      {/* Rivets */}
      <View style={[styles.rivet, { top: 4, left: 4 }]} />
      <View style={[styles.rivet, { top: 4, right: 4 }]} />
      <View style={[styles.rivet, { bottom: 4, left: 4 }]} />
      <View style={[styles.rivet, { bottom: 4, right: 4 }]} />

      <View style={styles.grid}>
        {mergedGrid.map((row, r) => (
          <View key={r} style={styles.row}>
            {row.map(({ tile, isTemp }, c) => {
              const bonusKey = getBonus(r, c);
              const bonus = bonusKey ? BONUS_COLORS[bonusKey] : null;
              const isPerm = grid[r][c] !== null;
              const isEmpty = !tile;
              const canDrop = isEmpty && selectedRackTile !== null;

              let cellBg = bonus?.bg ?? 'rgba(45,90,39,0.6)';
              if (tile) cellBg = 'transparent';
              if (canDrop) cellBg = 'rgba(200,168,48,0.3)';

              return (
                <TouchableOpacity
                  key={c}
                  activeOpacity={isPerm ? 1 : 0.7}
                  onPress={() => {
                    if (isTemp) {
                      onTempTilePress(r, c);
                    } else if (isEmpty) {
                      onCellPress(r, c);
                    }
                  }}
                  style={[
                    styles.cell,
                    { backgroundColor: cellBg },
                    canDrop && styles.cellHighlight,
                  ]}
                >
                  {tile ? (
                    // Tuile posée
                    <View style={[
                      styles.tileInner,
                      {
                        backgroundColor: isTemp ? COLORS.tileTemp : COLORS.tileBg,
                        borderColor: isTemp ? COLORS.tileTempBorder : COLORS.tileBorder,
                      },
                    ]}>
                      <Text style={[styles.tileLetter, { fontSize, color: isTemp ? '#2A4A10' : '#2A1800' }]}>
                        {tile.letter === '*' ? '★' : tile.letter}
                      </Text>
                      {tile.score > 0 && (
                        <Text style={[styles.tileScore, { fontSize: scoreFontSize, color: isTemp ? '#4A7A10' : '#6B4010' }]}>
                          {tile.score}
                        </Text>
                      )}
                      {/* Indicateur tap pour retour */}
                      {isTemp && (
                        <Text style={styles.returnHint}>↩</Text>
                      )}
                    </View>
                  ) : (
                    bonus && (
                      <Text style={[styles.bonusLabel, { color: bonus.text, fontSize: CELL_SIZE * 0.28 }]}>
                        {bonus.label}
                      </Text>
                    )
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  boardWrapper: {
    width: BOARD_SIZE,
    backgroundColor: '#1A3A18',
    borderRadius: 4,
    padding: 12,
    borderWidth: 3,
    borderColor: COLORS.goldDk,
    shadowColor: '#0A1A09',
    shadowOffset: { width: 6, height: 6 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 8,
    alignSelf: 'center',
    position: 'relative',
  },
  rivet: {
    position: 'absolute',
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: COLORS.gold,
    zIndex: 2,
  },
  grid: {
    gap: 1,
    backgroundColor: '#1A3A18',
  },
  row: {
    flexDirection: 'row',
    gap: 1,
  },
  cell: {
    width: CELL_SIZE,
    height: CELL_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 1,
    overflow: 'hidden',
  },
  cellHighlight: {
    borderWidth: 1,
    borderColor: 'rgba(200,168,48,0.8)',
  },
  tileInner: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderRadius: 2,
    position: 'relative',
  },
  tileLetter: {
    fontFamily: FONTS.playfair,
    fontWeight: '700',
    lineHeight: undefined,
  },
  tileScore: {
    fontFamily: FONTS.dmMono,
    position: 'absolute',
    bottom: 1,
    right: 2,
  },
  returnHint: {
    position: 'absolute',
    top: 0,
    left: 1,
    fontSize: 7,
    color: '#4A7A10',
    opacity: 0.7,
  },
  bonusLabel: {
    fontFamily: FONTS.dmMonoMedium,
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: undefined,
  },
});