// src/hooks/useGameLogic.ts
// Toute la logique métier extraite — identique au web, sans aucun import React Native.
import { useState, useEffect, useCallback } from 'react';
import { GameState, Placement, Tile } from '../types';
import { POINTS_LETTRES } from '../constants';
import * as gameService from '../api/gameService';
import { BONUS_MAP } from '../constants';

function calculatePreviewScore(placements: Placement[]): number {
  if (placements.length === 0) return 0;
  let score = 0;
  let wordMultiplier = 1;
  placements.forEach(p => {
    let letterScore = POINTS_LETTRES[p.letter] || 0;
    const bonus = BONUS_MAP[`${p.r}-${p.c}`];
    if (bonus === 'DL') letterScore *= 2;
    if (bonus === 'TL') letterScore *= 3;
    if (bonus === 'DM') wordMultiplier *= 2;
    if (bonus === 'TM') wordMultiplier *= 3;
    score += letterScore;
  });
  return score * wordMultiplier;
}

export function useGameLogic() {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [gameId, setGameId] = useState<string | null>(null);
  const [placements, setPlacements] = useState<Placement[]>([]);
  const [selectedForSwap, setSelectedForSwap] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const activePlayerId = gameState
    ? gameState.players[gameState.current_player_index].id
    : 0;

  const currentRack: Tile[] = gameState
    ? gameState.players.find(p => p.id === activePlayerId)?.rack ?? []
    : [];

  // Tuiles du rack pas encore posées sur le plateau
  const placedOriginals = placements.map(p => p.originalTile);
  const availableRackTiles = currentRack.filter(t => !placedOriginals.includes(t));

  const previewScore = calculatePreviewScore(placements);

  // ── Tour IA automatique ────────────────────────────────────────
  useEffect(() => {
    if (!gameState || gameState.status !== 'ACTIVE' || !gameId) return;
    const current = gameState.players[gameState.current_player_index];
    if (!current.is_ai) return;

    const timer = setTimeout(async () => {
      try {
        const updated = await gameService.aiPlayTurn(gameId);
        setGameState(updated);
      } catch (e: any) {
        console.error('Erreur IA:', e?.response?.data?.detail);
      }
    }, 1800);

    return () => clearTimeout(timer);
  }, [gameState, gameId]);

  // ── Actions ───────────────────────────────────────────────────

  const startGame = useCallback(async (playerNames: string[], difficulty = 'medium') => {
    setIsLoading(true);
    setError(null);
    try {
      const state = await gameService.startGame(playerNames, difficulty);
      setGameState(state);
      setGameId(state.game_id);
      setPlacements([]);
      setSelectedForSwap([]);
    } catch (e: any) {
      setError('Impossible de démarrer la partie. Vérifiez votre connexion.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Déposer une tuile depuis le rack vers une case du plateau.
   * rackIndex = index dans availableRackTiles (tuiles pas encore posées).
   */
  const dropTile = useCallback((rackIndex: number, r: number, c: number) => {
    const tile = availableRackTiles[rackIndex];
    if (!tile) return;
    if (placements.some(p => p.r === r && p.c === c)) return;
    setPlacements(prev => [...prev, { letter: tile.letter, r, c, originalTile: tile, rackIndex }]);
  }, [availableRackTiles, placements]);

  /**
   * Déplacer une tuile temporaire d'une case à une autre.
   */
  const moveTile = useCallback((fromR: number, fromC: number, toR: number, toC: number) => {
    if (placements.some(p => p.r === toR && p.c === toC)) return;
    setPlacements(prev =>
      prev.map(p => p.r === fromR && p.c === fromC ? { ...p, r: toR, c: toC } : p)
    );
  }, [placements]);

  /**
   * Retirer une tuile temporaire du plateau → revient dans le rack.
   */
  const returnTile = useCallback((r: number, c: number) => {
    setPlacements(prev => prev.filter(p => !(p.r === r && p.c === c)));
  }, []);

  const validateWord = useCallback(async () => {
    if (!gameId || placements.length === 0) return { success: false, error: 'Aucune tuile posée.' };
    setIsLoading(true);
    try {
      const api = placements.map(p => [p.r, p.c, p.letter] as [number, number, string]);
      const result = await gameService.playWord(gameId, activePlayerId, api);
      setGameState(result);
      setPlacements([]);
      setSelectedForSwap([]);
      return { success: true, error: null };
    } catch (e: any) {
      const msg = e?.response?.data?.detail || 'Mot invalide ou placement illégal.';
      setPlacements([]);
      return { success: false, error: msg };
    } finally {
      setIsLoading(false);
    }
  }, [gameId, placements, activePlayerId]);

  const passTurn = useCallback(async () => {
    if (!gameId) return;
    try {
      const updated = await gameService.passTurn(gameId, activePlayerId);
      setGameState(updated);
      setPlacements([]);
    } catch (e: any) {
      setError(e?.response?.data?.detail || 'Erreur réseau.');
    }
  }, [gameId, activePlayerId]);

  const shuffleRack = useCallback(async () => {
    if (!gameId) return;
    try {
      const updated = await gameService.shuffleRack(gameId, activePlayerId);
      setGameState(updated);
    } catch (e: any) {
      setError(e?.response?.data?.detail || 'Erreur réseau.');
    }
  }, [gameId, activePlayerId]);

  const toggleTileForSwap = useCallback((letter: string) => {
    setSelectedForSwap(prev =>
      prev.includes(letter) ? prev.filter(l => l !== letter) : [...prev, letter]
    );
  }, []);

  const swapTiles = useCallback(async () => {
    if (!gameId || selectedForSwap.length === 0) return;
    setPlacements([]);
    try {
      const updated = await gameService.swapTiles(gameId, activePlayerId, selectedForSwap);
      setGameState(updated);
      setSelectedForSwap([]);
    } catch (e: any) {
      setError(e?.response?.data?.detail || 'Échange impossible.');
    }
  }, [gameId, activePlayerId, selectedForSwap]);

  const clearError = useCallback(() => setError(null), []);

  const clearSwap = useCallback(() => {
    setSelectedForSwap([]);
  }, []);

  return {
    // State
    gameState,
    gameId,
    placements,
    selectedForSwap,
    error,
    isLoading,
    activePlayerId,
    availableRackTiles,
    previewScore,
    // Actions
    startGame,
    dropTile,
    moveTile,
    returnTile,
    validateWord,
    passTurn,
    shuffleRack,
    toggleTileForSwap,
    swapTiles,
    clearError,
    clearSwap,
  };
}