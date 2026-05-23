// src/components/Tile.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS, FONTS } from '../constants';
import { Tile as TileType } from '../types';

interface Props {
  tile: TileType;
  size?: number;
  isTemp?: boolean;
  isSelected?: boolean;
  onPress?: () => void;
}

export default function Tile({ tile, size = 38, isTemp = false, isSelected = false, onPress }: Props) {
  const isJoker = tile.letter === '*';

  const getBg = () => {
    if (isTemp)     return COLORS.tileTemp;
    if (isSelected) return '#F5C87A';
    if (isJoker)    return '#E8E0CC';
    return COLORS.tileBg;
  };

  const getBorder = () => {
    if (isTemp)     return COLORS.tileTempBorder;
    if (isSelected) return COLORS.tobacco;
    if (isJoker)    return '#B0A080';
    return COLORS.tileBorder;
  };

  const getTextColor = () => {
    if (isTemp)     return '#2A4A10';
    if (isSelected) return '#4A2800';
    if (isJoker)    return '#6B5E45';
    return '#2A1800';
  };

  const content = (
    <View style={[
      styles.tile,
      {
        width: size,
        height: size,
        backgroundColor: getBg(),
        borderColor: getBorder(),
        shadowColor: isTemp ? COLORS.tileTempShadow : COLORS.tileShadow,
      },
      isSelected && styles.selectedRing,
      isTemp && styles.tempRing,
    ]}>
      <Text style={[styles.letter, { fontSize: size * 0.42, color: getTextColor() }]}>
        {isJoker ? '★' : tile.letter}
      </Text>
      {tile.score > 0 && (
        <Text style={[styles.score, { fontSize: size * 0.22, color: getTextColor(), opacity: 0.7 }]}>
          {tile.score}
        </Text>
      )}
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
        {content}
      </TouchableOpacity>
    );
  }

  return content;
}

const styles = StyleSheet.create({
  tile: {
    borderWidth: 2,
    borderRadius: 3,
    justifyContent: 'center',
    alignItems: 'center',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 3,
    position: 'relative',
  },
  letter: {
    fontFamily: FONTS.playfair,
    fontWeight: '700',
    lineHeight: undefined,
  },
  score: {
    fontFamily: FONTS.dmMono,
    position: 'absolute',
    bottom: 1,
    right: 2,
    lineHeight: undefined,
  },
  selectedRing: {
    shadowColor: COLORS.tobacco,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 6,
  },
  tempRing: {
    shadowColor: COLORS.tileTempShadow,
  },
});