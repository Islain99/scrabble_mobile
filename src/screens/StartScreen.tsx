// src/screens/StartScreen.tsx
import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  ActivityIndicator, ScrollView, TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, FONTS } from '../constants';

const DIFFICULTIES = [
  { key: 'beginner', label: 'Débutant', emoji: '🐣', desc: 'Mots courts, beaucoup d\'erreurs' },
  { key: 'easy',     label: 'Facile',   emoji: '🟢', desc: 'Mots courts, ignore les bonus' },
  { key: 'medium',   label: 'Moyen',    emoji: '🟡', desc: 'Équilibré, quelques bonus' },
  { key: 'hard',     label: 'Expert',   emoji: '🔴', desc: 'Maximise chaque score' },
];

interface Props {
  onStart: (playerName: string, difficulty: string) => void;
  isLoading: boolean;
}

export default function StartScreen({ onStart, isLoading }: Props) {
  const [playerName, setPlayerName] = useState('');
  const [difficulty, setDifficulty] = useState('medium');

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">

        {/* Masthead */}
        <View style={styles.masthead}>
          <Text style={styles.edition}>Édition de Luxe — 1972</Text>
          <Text style={styles.title}>SCRABBLE</Text>
          <View style={styles.goldBar} />
          <Text style={styles.subtitle}>Le jeu classique des mots croisés</Text>
        </View>

        {/* Card */}
        <View style={styles.card}>

          {/* Player name */}
          <Text style={styles.sectionLabel}>Votre nom</Text>
          <TextInput
            style={styles.input}
            value={playerName}
            onChangeText={setPlayerName}
            placeholder="Joueur 1"
            placeholderTextColor={COLORS.muted}
            maxLength={20}
            autoCorrect={false}
          />

          {/* Difficulty */}
          <Text style={[styles.sectionLabel, { marginTop: 20 }]}>Difficulté de l'IA</Text>
          <View style={styles.difficultyGrid}>
            {DIFFICULTIES.map(d => (
              <TouchableOpacity
                key={d.key}
                activeOpacity={0.8}
                onPress={() => setDifficulty(d.key)}
                style={[styles.diffBtn, difficulty === d.key && styles.diffBtnActive]}
              >
                <Text style={styles.diffEmoji}>{d.emoji}</Text>
                <Text style={[styles.diffLabel, difficulty === d.key && { color: COLORS.cream }]}>
                  {d.label}
                </Text>
                <Text style={[styles.diffDesc, difficulty === d.key && { color: 'rgba(245,237,214,0.7)' }]}>
                  {d.desc}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Start button */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => onStart(playerName.trim() || 'Joueur 1', difficulty)}
            disabled={isLoading}
            style={[styles.startBtn, isLoading && { opacity: 0.6 }]}
          >
            {isLoading ? (
              <ActivityIndicator color={COLORS.cream} />
            ) : (
              <Text style={styles.startBtnText}>Démarrer la partie</Text>
            )}
          </TouchableOpacity>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.cream },
  container: { flexGrow: 1, padding: 20, alignItems: 'center', justifyContent: 'center', gap: 28 },
  masthead: { alignItems: 'center', gap: 6 },
  edition: {
    fontFamily: FONTS.dmMono,
    fontSize: 11,
    letterSpacing: 3,
    color: COLORS.muted,
    textTransform: 'uppercase',
  },
  title: {
    fontFamily: FONTS.playfairBlack,
    fontSize: 64,
    color: COLORS.ink,
    letterSpacing: -2,
    lineHeight: 68,
  },
  goldBar: {
    height: 4,
    width: 200,
    backgroundColor: COLORS.tobacco,
    borderRadius: 2,
    marginVertical: 8,
  },
  subtitle: {
    fontFamily: FONTS.baskervilleItalic,
    fontSize: 15,
    color: COLORS.olive,
    fontStyle: 'italic',
  },
  card: {
    width: '100%',
    backgroundColor: COLORS.cream,
    borderWidth: 3,
    borderColor: COLORS.ink,
    borderRadius: 2,
    padding: 24,
    shadowColor: COLORS.tobacco,
    shadowOffset: { width: 6, height: 6 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 6,
  },
  sectionLabel: {
    fontFamily: FONTS.dmMono,
    fontSize: 11,
    color: COLORS.muted,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  input: {
    borderWidth: 2,
    borderColor: COLORS.ink,
    borderRadius: 2,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontFamily: FONTS.baskerville,
    fontSize: 16,
    color: COLORS.ink,
    backgroundColor: '#EDE0C0',
  },
  difficultyGrid: { gap: 8 },
  diffBtn: {
    borderWidth: 2,
    borderColor: COLORS.inkLt,
    borderRadius: 2,
    padding: 12,
    backgroundColor: '#EDE0C0',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  diffBtnActive: {
    backgroundColor: COLORS.ink,
    borderColor: COLORS.gold,
    shadowColor: COLORS.tobacco,
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 3,
  },
  diffEmoji: { fontSize: 20 },
  diffLabel: {
    fontFamily: FONTS.playfair,
    fontSize: 15,
    color: COLORS.inkLt,
    fontWeight: '700',
    width: 70,
  },
  diffDesc: {
    fontFamily: FONTS.dmMono,
    fontSize: 10,
    color: COLORS.muted,
    flex: 1,
    letterSpacing: 0.3,
  },
  startBtn: {
    marginTop: 24,
    backgroundColor: COLORS.olive,
    borderWidth: 2,
    borderColor: '#3D4A20',
    borderRadius: 2,
    paddingVertical: 14,
    alignItems: 'center',
    shadowColor: '#2A3010',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  startBtnText: {
    fontFamily: FONTS.dmMono,
    fontSize: 13,
    fontWeight: '500',
    color: COLORS.cream,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
});