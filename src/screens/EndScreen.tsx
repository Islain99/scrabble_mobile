// src/screens/EndScreen.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, FONTS } from '../constants';
import { GameState } from '../types';

interface Props {
  gameState: GameState;
  onRestart: () => void;
}

export default function EndScreen({ gameState, onRestart }: Props) {
  const sorted = [...gameState.players].sort((a, b) => b.score - a.score);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>

        <Text style={styles.overLabel}>Partie terminée</Text>

        <Text style={styles.winnerName}>{gameState.winner_name}</Text>
        <Text style={styles.winnerSub}>remporte la victoire</Text>

        <View style={styles.goldBar} />

        {/* Scores finaux */}
        <View style={styles.scoreCard}>
          {sorted.map((player, idx) => (
            <View key={player.id} style={[styles.playerRow, idx === 0 && styles.winnerRow]}>
              <Text style={styles.rank}>{idx + 1}</Text>
              <Text style={[styles.playerName, idx === 0 && { color: COLORS.gold }]}>
                {player.name}
              </Text>
              <Text style={[styles.playerScore, idx === 0 && { color: COLORS.gold }]}>
                {player.score} pts
              </Text>
            </View>
          ))}
        </View>

        <TouchableOpacity style={styles.restartBtn} onPress={onRestart} activeOpacity={0.8}>
          <Text style={styles.restartBtnText}>Nouvelle Partie</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.cream },
  container: { flexGrow: 1, padding: 28, alignItems: 'center', justifyContent: 'center', gap: 16 },
  overLabel: {
    fontFamily: FONTS.dmMono,
    fontSize: 11,
    color: COLORS.muted,
    letterSpacing: 2.5,
    textTransform: 'uppercase',
  },
  winnerName: {
    fontFamily: FONTS.playfairBlack,
    fontSize: 48,
    color: COLORS.ink,
    letterSpacing: -1.5,
    textAlign: 'center',
  },
  winnerSub: {
    fontFamily: FONTS.baskervilleItalic,
    fontSize: 16,
    color: COLORS.olive,
    fontStyle: 'italic',
  },
  goldBar: {
    height: 4,
    width: 160,
    backgroundColor: COLORS.tobacco,
    borderRadius: 2,
    marginVertical: 4,
  },
  scoreCard: {
    width: '100%',
    borderWidth: 2,
    borderColor: COLORS.ink,
    borderRadius: 2,
    overflow: 'hidden',
    shadowColor: COLORS.tobacco,
    shadowOffset: { width: 5, height: 5 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 5,
  },
  playerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#EDE0C0',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(200,168,48,0.2)',
    gap: 12,
  },
  winnerRow: { backgroundColor: COLORS.ink },
  rank: {
    fontFamily: FONTS.dmMono,
    fontSize: 12,
    color: COLORS.muted,
    width: 20,
    textAlign: 'center',
  },
  playerName: {
    fontFamily: FONTS.playfair,
    fontSize: 17,
    color: COLORS.inkLt,
    flex: 1,
    fontWeight: '700',
  },
  playerScore: {
    fontFamily: FONTS.dmMono,
    fontSize: 18,
    color: COLORS.muted,
    fontWeight: '500',
  },
  restartBtn: {
    marginTop: 8,
    width: '100%',
    backgroundColor: COLORS.olive,
    borderWidth: 2,
    borderColor: '#3D4A20',
    borderRadius: 2,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: '#2A3010',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  restartBtnText: {
    fontFamily: FONTS.dmMono,
    fontSize: 13,
    color: COLORS.cream,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
});