// src/components/Board.tsx
import React, { useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  Dimensions, Animated,
} from 'react-native';
import { COLORS, FONTS } from '../constants';
import { GameState, Placement, Tile } from '../types';

const SCREEN_W = Dimensions.get('window').width;
const BOARD_SIZE = SCREEN_W - 32;
const CELL_SIZE = Math.floor((BOARD_SIZE - 24) / 15);

const BONUS_COLORS: Record<string, { bg: string; label: string; text: string }> = {
  TM:    { bg: '#8B2020', label: '3M', text: '#F5D0C0' },
  DM:    { bg: '#C8803A', label: '2M', text: '#FFF0D8' },
  TL:    { bg: '#1A4A8A', label: '3L', text: '#C8DCFF' },
  DL:    { bg: '#3A7EB8', label: '2L', text: '#DCEEFF' },
  START: { bg: '#8B4A20', label: '★',  text: '#FFE8C0' },
};

import { BONUS_MAP } from '../constants'; // Fix 5
const getBonus = (r: number, c: number): string | null =>
  BONUS_MAP[`${r}-${c}`] ?? null;

// ── Cellule vide disponible (pulse doré) ───────────────────────
function AvailableCell({
  onPress, bonus, size,
}: {
  onPress: () => void;
  bonus: { bg: string; label: string; text: string } | null;
  size: number;
}) {
  const pulse = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const anim = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1,   duration: 600, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 0.3, duration: 600, useNativeDriver: true }),
      ])
    );
    anim.start();
    return () => anim.stop();
  }, []);

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.6}
      style={[styles.cell, { backgroundColor: bonus?.bg ?? 'rgba(45,90,39,0.6)' }]}
    >
      {/* Overlay doré qui pulse */}
      <Animated.View
        style={[
          styles.pulseOverlay,
          {
            opacity: pulse,
            width: size,
            height: size,
            borderColor: '#C8A830',
          },
        ]}
      />
      {bonus && (
        <Text style={[styles.bonusLabel, { color: bonus.text, fontSize: size * 0.28 }]}>
          {bonus.label}
        </Text>
      )}
    </TouchableOpacity>
  );
}

// ── Tuile temporaire (pulse vert + ↩) ─────────────────────────
function TempTileCell({
  tile, onPress, size,
}: {
  tile: { letter: string; score: number };
  onPress: () => void;
  size: number;
}) {
  const pulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const anim = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 0.7, duration: 700, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 1.0, duration: 700, useNativeDriver: true }),
      ])
    );
    anim.start();
    return () => anim.stop();
  }, []);

  const fontSize = size * 0.42;
  const scoreFontSize = size * 0.22;

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.6}
      style={styles.cell}
    >
      <Animated.View
        style={[
          styles.tileInner,
          {
            backgroundColor: COLORS.tileTemp,
            borderColor: COLORS.tileTempBorder,
            opacity: pulse,
          },
        ]}
      >
        <Text style={[styles.tileLetter, { fontSize, color: '#2A4A10' }]}>
          {tile.letter === '*' ? '★' : tile.letter}
        </Text>
        {tile.score > 0 && (
          <Text style={[styles.tileScore, { fontSize: scoreFontSize, color: '#4A7A10' }]}>
            {tile.score}
          </Text>
        )}
        {/* Icône retour */}
        <Text style={[styles.returnHint, { fontSize: size * 0.22 }]}>↩</Text>
      </Animated.View>
    </TouchableOpacity>
  );
}

// ── Tuile permanente (pas d'interaction) ──────────────────────
function PermTileCell({
  tile, size,
}: {
  tile: { letter: string; score: number };
  size: number;
}) {
  const fontSize = size * 0.42;
  const scoreFontSize = size * 0.22;

  return (
    <View style={[styles.cell, { opacity: 1 }]}>
      <View style={[styles.tileInner, {
        backgroundColor: COLORS.tileBg,
        borderColor: COLORS.tileBorder,
      }]}>
        <Text style={[styles.tileLetter, { fontSize, color: '#2A1800' }]}>
          {tile.letter === '*' ? '★' : tile.letter}
        </Text>
        {tile.score > 0 && (
          <Text style={[styles.tileScore, { fontSize: scoreFontSize, color: '#6B4010' }]}>
            {tile.score}
          </Text>
        )}
      </View>
    </View>
  );
}

// ── Cellule vide neutre (aucune tuile sélectionnée) ───────────
function EmptyCell({
  bonus, size,
}: {
  bonus: { bg: string; label: string; text: string } | null;
  size: number;
}) {
  return (
    <View style={[styles.cell, { backgroundColor: bonus?.bg ?? 'rgba(45,90,39,0.6)' }]}>
      {bonus && (
        <Text style={[styles.bonusLabel, { color: bonus.text, fontSize: size * 0.28 }]}>
          {bonus.label}
        </Text>
      )}
    </View>
  );
}

// ── Board principal ───────────────────────────────────────────
interface Props {
  gameState: GameState;
  placements: Placement[];
  selectedRackTile: Tile | null;
  onCellPress: (r: number, c: number) => void;
  onTempTilePress: (r: number, c: number) => void;
}

export default function Board({
  gameState, placements, selectedRackTile, onCellPress, onTempTilePress,
}: Props) {
  const grid = gameState.board.grid;

  const tempMap: Record<string, Placement> = {};
  placements.forEach(p => { tempMap[`${p.r}-${p.c}`] = p; });

  return (
    <View style={styles.boardWrapper}>
      <View style={[styles.rivet, { top: 4, left: 4 }]} />
      <View style={[styles.rivet, { top: 4, right: 4 }]} />
      <View style={[styles.rivet, { bottom: 4, left: 4 }]} />
      <View style={[styles.rivet, { bottom: 4, right: 4 }]} />

      <View style={styles.grid}>
        {grid.map((row, r) => (
          <View key={r} style={styles.row}>
            {row.map((cell, c) => {
              const bonusKey = getBonus(r, c);
              const bonus = bonusKey ? BONUS_COLORS[bonusKey] : null;
              const temp = tempMap[`${r}-${c}`];
              const isPerm = cell !== null;

              // 1. Tuile permanente
              if (isPerm) {
                return <PermTileCell key={c} tile={cell!} size={CELL_SIZE} />;
              }

              // 2. Tuile temporaire (posée ce tour)
              if (temp) {
                return (
                  <TempTileCell
                    key={c}
                    tile={temp.originalTile}
                    onPress={() => onTempTilePress(r, c)}
                    size={CELL_SIZE}
                  />
                );
              }

              // 3. Case vide — pulse si tuile sélectionnée, sinon neutre
              if (selectedRackTile) {
                return (
                  <AvailableCell
                    key={c}
                    onPress={() => onCellPress(r, c)}
                    bonus={bonus}
                    size={CELL_SIZE}
                  />
                );
              }

              return <EmptyCell key={c} bonus={bonus} size={CELL_SIZE} />;
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
  grid: { gap: 1, backgroundColor: '#1A3A18' },
  row: { flexDirection: 'row', gap: 1 },
  cell: {
    width: CELL_SIZE,
    height: CELL_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 1,
    overflow: 'hidden',
  },
  pulseOverlay: {
    position: 'absolute',
    borderRadius: 2,
    borderWidth: 1.5,
    backgroundColor: 'rgba(200,168,48,0.18)',
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
  },
  tileScore: {
    fontFamily: FONTS.dmMono,
    position: 'absolute',
    bottom: 1,
    right: 2,
  },
  returnHint: {
    position: 'absolute',
    top: 1,
    left: 2,
    color: '#3A6A08',
    opacity: 0.85,
  },
  bonusLabel: {
    fontFamily: FONTS.dmMono,
    fontWeight: '700',
    textAlign: 'center',
  },
});