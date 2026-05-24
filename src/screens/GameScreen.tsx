// src/screens/GameScreen.tsx
import React, { useState, useCallback, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, Alert, Modal,
  TouchableOpacity, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Board from '../components/Board';
import TileRack from '../components/TileRack';
import ScorePanel from '../components/ScorePanel';
import ActionBar from '../components/ActionBar';
import { COLORS, FONTS } from '../constants';
import { Tile, GameState, Placement } from '../types';

interface Props {
  gameState: GameState;
  placements: Placement[];
  previewScore: number;
  isLoading: boolean;
  activePlayerId: number;
  availableRackTiles: Tile[];
  selectedForSwap: string[];
  error: string | null;
  onDropTile: (rackIndex: number, r: number, c: number) => void;
  onMoveTile: (fromR: number, fromC: number, toR: number, toC: number) => void;
  onReturnTile: (r: number, c: number) => void;
  onValidate: () => Promise<{ success: boolean; error: string | null }>;
  onPass: () => void;
  onShuffle: () => void;
  onToggleSwap: (letter: string) => void;
  onSwap: () => void;
  onClearSwap: () => void;
  onClearError: () => void;
}

export default function GameScreen({
  gameState, placements, previewScore, isLoading, activePlayerId,
  availableRackTiles, selectedForSwap, error,
  onDropTile, onMoveTile, onReturnTile,
  onValidate, onPass, onShuffle, onToggleSwap, onSwap, 
  onClearSwap, onClearError,
}: Props) {
  // Tuile du rack sélectionnée pour placement
  const [selectedRackTile, setSelectedRackTile] = useState<{ tile: Tile; index: number } | null>(null);
  const [showSwapPanel, setShowSwapPanel] = useState(false);

  useEffect(() => {
    if (error) {
      Alert.alert('Erreur réseau', error, [
        { text: 'OK', onPress: onClearError }
      ]);
    }
  }, [error]);

  const currentPlayer = gameState.players[gameState.current_player_index];
  const isSwapMode = showSwapPanel;
  const isAITurn = currentPlayer.is_ai;

  // Tap sur une tuile du rack → sélectionner pour pose
  const handleRackTilePress = useCallback((tile: Tile, index: number) => {
    if (isAITurn) return;
    setSelectedRackTile(prev =>
      prev?.index === index ? null : { tile, index }
    );
  }, [isAITurn]);

  // Tap sur une case vide du plateau
  const handleCellPress = useCallback((r: number, c: number) => {
    if (!selectedRackTile || isAITurn) return;
    onDropTile(selectedRackTile.index, r, c);
    setSelectedRackTile(null);
  }, [selectedRackTile, isAITurn, onDropTile]);

  // Tap sur une tuile temporaire → retour rack
  const handleTempTilePress = useCallback((r: number, c: number) => {
    onReturnTile(r, c);
    setSelectedRackTile(null);
  }, [onReturnTile]);

  const handleValidate = async () => {
    setSelectedRackTile(null);
    const { success, error } = await onValidate();
    if (!success && error) {
      Alert.alert('Mot invalide', error, [{ text: 'OK' }]);
    }
  };

  const handlePass = () => {
    setSelectedRackTile(null);
    Alert.alert('Passer le tour', 'Confirmez-vous ?', [
      { text: 'Annuler', style: 'cancel' },
      { text: 'Passer', onPress: onPass },
    ]);
  };

  const handleSwapConfirm = () => {
    if (selectedForSwap.length === 0) {
      Alert.alert('Aucune lettre sélectionnée', 'Appuyez sur les lettres à échanger.');
      return;
    }
    onSwap();
    setShowSwapPanel(false);
  };

  const actionButtons = [
    {
      label: `Valider (${placements.length})`,
      onPress: handleValidate,
      disabled: placements.length === 0 || isSwapMode || isAITurn,
      variant: 'primary' as const,
    },
    {
      label: 'Passer',
      onPress: handlePass,
      disabled: placements.length > 0 || isSwapMode || isAITurn,
      variant: 'default' as const,
    },
    {
      label: '⇄',
      onPress: () => { setSelectedRackTile(null); setShowSwapPanel(true); },
      disabled: isAITurn || placements.length > 0,
      variant: 'tobacco' as const,
    },
    {
      label: '⇅',
      onPress: onShuffle,
      disabled: isAITurn || placements.length > 0,
      variant: 'default' as const,
    },
  ];

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>SCRABBLE</Text>
        <Text style={styles.headerTurn}>
          Tour : <Text style={{ color: COLORS.tobacco }}>{currentPlayer.name}</Text>
          {isAITurn && ' ⏳'}
        </Text>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Scores */}
        <ScorePanel
          players={gameState.players}
          currentPlayerId={activePlayerId}
          remainingTiles={gameState.remaining_tiles.length}
        />

        {/* Instruction contextuelle */}
        <View style={styles.hint}>
          <Text style={styles.hintText}>
            {isAITurn
              ? 'L\'IA réfléchit...'
              : selectedRackTile
              ? `"${selectedRackTile.tile.letter}" sélectionnée — tapez une case vide`
              : placements.length > 0
              ? `${placements.length} tuile(s) posée(s) — tapez une tuile verte pour la récupérer`
              : 'Tapez une lettre du rack puis une case du plateau'}
          </Text>
        </View>

        {/* Plateau */}
        <Board
          gameState={gameState}
          placements={placements}
          selectedRackTile={selectedRackTile?.tile ?? null}
          onCellPress={handleCellPress}
          onTempTilePress={handleTempTilePress}
        />

        {/* Rack */}
        <View style={styles.rackWrapper}>
          <TileRack
            tiles={availableRackTiles}
            playerId={activePlayerId}
            selectedTile={selectedRackTile?.tile ?? null}
            onTilePress={handleRackTilePress}
            isSwapMode={false}
            tilesSelectedForSwap={[]}
            onSwapTilePress={() => {}}
          />
        </View>

        {isLoading && (
          <ActivityIndicator color={COLORS.tobacco} style={{ marginTop: 8 }} />
        )}
      </ScrollView>

      {/* Action bar fixe */}
      <ActionBar
        buttons={actionButtons}
        previewScore={previewScore}
        placementCount={placements.length}
      />

      {/* Modal échange */}
      <Modal visible={showSwapPanel} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Échanger des lettres</Text>
            <Text style={styles.modalSubtitle}>Sélectionnez les lettres à remettre dans le sac</Text>

            <TileRack
              tiles={availableRackTiles}
              playerId={activePlayerId}
              selectedTile={null}
              onTilePress={() => {}}
              isSwapMode
              tilesSelectedForSwap={selectedForSwap}
              onSwapTilePress={onToggleSwap}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalBtn, { borderColor: COLORS.ink }]}
                onPress={() => {
                  setShowSwapPanel(false);
                  onClearSwap();
                  // vider la sélection si l'utilisateur ferme sans confirmer
                  selectedForSwap.forEach(() => {}); // pas d'accès direct → passer un callback
                }}
              >
                <Text style={[styles.modalBtnText, { color: COLORS.ink }]}>Annuler</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalBtn, { backgroundColor: COLORS.olive, borderColor: '#3D4A20' }]}
                onPress={handleSwapConfirm}
              >
                <Text style={[styles.modalBtnText, { color: COLORS.cream }]}>
                  Échanger ({selectedForSwap.length})
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.cream },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 3,
    borderBottomColor: COLORS.ink,
    backgroundColor: COLORS.cream,
  },
  headerTitle: {
    fontFamily: FONTS.playfairBlack,
    fontSize: 28,
    color: COLORS.ink,
    letterSpacing: -1,
  },
  headerTurn: {
    fontFamily: FONTS.dmMono,
    fontSize: 11,
    color: COLORS.muted,
    letterSpacing: 0.5,
  },
  scroll: { flex: 1 },
  scrollContent: {
    padding: 16,
    gap: 12,
    paddingBottom: 8,
  },
  hint: {
    backgroundColor: '#EDE0C0',
    borderWidth: 1,
    borderColor: 'rgba(200,168,48,0.4)',
    borderRadius: 2,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  hintText: {
    fontFamily: FONTS.dmMono,
    fontSize: 11,
    color: COLORS.muted,
    textAlign: 'center',
    letterSpacing: 0.3,
  },
  rackWrapper: { marginTop: 4 },
  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(30,26,18,0.7)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: COLORS.cream,
    borderTopWidth: 3,
    borderTopColor: COLORS.ink,
    borderLeftWidth: 3,
    borderRightWidth: 3,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    padding: 20,
    gap: 14,
    shadowColor: COLORS.ink,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  modalTitle: {
    fontFamily: FONTS.playfair,
    fontSize: 22,
    color: COLORS.ink,
    fontWeight: '700',
  },
  modalSubtitle: {
    fontFamily: FONTS.dmMono,
    fontSize: 11,
    color: COLORS.muted,
    letterSpacing: 0.5,
  },
  modalButtons: { flexDirection: 'row', gap: 10, marginTop: 4 },
  modalBtn: {
    flex: 1,
    borderWidth: 2,
    borderRadius: 2,
    paddingVertical: 12,
    alignItems: 'center',
    shadowColor: COLORS.ink,
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 0,
    elevation: 2,
  },
  modalBtnText: {
    fontFamily: FONTS.dmMono,
    fontSize: 12,
    fontWeight: '500',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
});