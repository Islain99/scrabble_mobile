// src/components/ActionBar.tsx
// Barre d'actions en bas de l'écran de jeu.
import React from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS, FONTS } from '../constants';

interface ActionBtn {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'default' | 'danger' | 'tobacco';
}

interface Props {
  buttons: ActionBtn[];
  previewScore: number;
  placementCount: number;
}

export default function ActionBar({ buttons, previewScore, placementCount }: Props) {
  const variantStyles = {
    primary:  { bg: COLORS.olive,   border: '#3D4A20', text: COLORS.cream },
    default:  { bg: 'transparent',  border: COLORS.ink, text: COLORS.ink },
    danger:   { bg: 'transparent',  border: '#8B2020', text: '#8B2020' },
    tobacco:  { bg: 'transparent',  border: COLORS.tobacco, text: COLORS.tobaccoDk },
  };

  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom + 8 }]}>
      {/* Score preview */}
      {placementCount > 0 && (
        <View style={styles.preview}>
          <Text style={styles.previewLabel}>{placementCount} tuile{placementCount > 1 ? 's' : ''} — score estimé</Text>
          <Text style={styles.previewScore}>{previewScore} pts</Text>
        </View>
      )}

      {/* Buttons */}
      <View style={styles.buttonsRow}>
        {buttons.map((btn, i) => {
          const v = variantStyles[btn.variant ?? 'default'];
          return (
            <TouchableOpacity
              key={i}
              onPress={btn.onPress}
              disabled={btn.disabled}
              activeOpacity={0.75}
              style={[
                styles.btn,
                {
                  backgroundColor: btn.disabled ? 'transparent' : v.bg,
                  borderColor: btn.disabled ? COLORS.muted : v.border,
                  opacity: btn.disabled ? 0.5 : 1,
                },
                buttons.length === 1 && { flex: 1 },
              ]}
            >
              <Text style={[styles.btnText, { color: btn.disabled ? COLORS.muted : v.text }]}>
                {btn.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.cream,
    borderTopWidth: 2,
    borderTopColor: COLORS.ink,
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 4,
    gap: 8,
  },
  preview: {
    backgroundColor: COLORS.ink,
    borderWidth: 1.5,
    borderColor: COLORS.gold,
    borderRadius: 2,
    paddingHorizontal: 14,
    paddingVertical: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  previewLabel: {
    fontFamily: FONTS.dmMono,
    fontSize: 11,
    color: COLORS.muted,
    letterSpacing: 0.5,
  },
  previewScore: {
    fontFamily: FONTS.playfair,
    fontSize: 22,
    color: COLORS.gold,
    fontWeight: '700',
  },
  buttonsRow: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  btn: {
    borderWidth: 2,
    borderRadius: 2,
    paddingVertical: 9,
    paddingHorizontal: 14,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.ink,
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.6,
    shadowRadius: 0,
    elevation: 2,
  },
  btnText: {
    fontFamily: FONTS.dmMono,
    fontSize: 11,
    fontWeight: '500',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
});