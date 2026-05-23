// src/components/ScorePanel.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, FONTS } from '../constants';
import { Player } from '../types';

interface Props {
  players: Player[];
  currentPlayerId: number;
  remainingTiles: number;
}

export default function ScorePanel({ players, currentPlayerId, remainingTiles }: Props) {
  return (
    <View style={styles.container}>
      {players.map((player, idx) => {
        const isActive = player.id === currentPlayerId;
        return (
          <View key={player.id} style={[styles.playerRow, isActive && styles.activeRow]}>
            <View style={[styles.dot, { backgroundColor: isActive ? COLORS.gold : COLORS.muted }]} />
            <Text style={[styles.name, { color: isActive ? COLORS.gold : COLORS.inkLt }]} numberOfLines={1}>
              {player.name}
            </Text>
            {player.is_ai && (
              <Text style={styles.aiBadge}>IA</Text>
            )}
            <Text style={[styles.score, { color: isActive ? COLORS.gold : COLORS.muted }]}>
              {player.score}
            </Text>
          </View>
        );
      })}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Tuiles restantes : {remainingTiles}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.cream,
    borderWidth: 2,
    borderColor: COLORS.ink,
    borderRadius: 2,
    overflow: 'hidden',
    shadowColor: COLORS.tobacco,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  playerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
    backgroundColor: '#EDE0C0',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(200,168,48,0.2)',
  },
  activeRow: {
    backgroundColor: COLORS.ink,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    flexShrink: 0,
  },
  name: {
    fontFamily: FONTS.playfair,
    fontSize: 15,
    flex: 1,
  },
  aiBadge: {
    fontFamily: FONTS.dmMono,
    fontSize: 9,
    color: COLORS.tobacco,
    borderWidth: 1,
    borderColor: COLORS.tobacco,
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 2,
    letterSpacing: 1,
  },
  score: {
    fontFamily: FONTS.dmMono,
    fontSize: 22,
    fontWeight: '500',
    letterSpacing: -0.5,
  },
  footer: {
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(200,168,48,0.3)',
    backgroundColor: COLORS.cream,
  },
  footerText: {
    fontFamily: FONTS.dmMono,
    fontSize: 10,
    color: COLORS.muted,
    letterSpacing: 0.5,
    textAlign: 'center',
  },
});