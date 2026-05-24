// app/index.tsx
// Point d'entrée principal — orchestre StartScreen, GameScreen, EndScreen.
import React from 'react';
import StartScreen from '../screens/StartScreen';
import GameScreen from '../screens/GameScreen';
import EndScreen from '../screens/EndScreen';
import { useGameLogic } from '../hooks/useGameLogic';

export default function Index() {
  const game = useGameLogic();

  // ── Écran de démarrage ─────────────────────────────────────────
  if (!game.gameState || game.gameState.status === 'SETUP') {
    return (
      <StartScreen
        onStart={(playerName, difficulty) =>
          game.startGame([playerName, 'HAL 9000 (IA)'], difficulty)
        }
        isLoading={game.isLoading}
      />
    );
  }

  // ── Écran de fin ───────────────────────────────────────────────
  if (game.gameState.status === 'FINISHED') {
    return (
      <EndScreen
        gameState={game.gameState}
        onRestart={() => game.startGame(['Joueur 1', 'HAL 9000 (IA)'])}
      />
    );
  }

  // ── Écran de jeu ──────────────────────────────────────────────
  return (
    <GameScreen
      gameState={game.gameState}
      placements={game.placements}
      previewScore={game.previewScore}
      isLoading={game.isLoading}
      activePlayerId={game.activePlayerId}
      availableRackTiles={game.availableRackTiles}
      selectedForSwap={game.selectedForSwap}
      error={game.error}
      onDropTile={game.dropTile}
      onMoveTile={game.moveTile}
      onReturnTile={game.returnTile}
      onValidate={game.validateWord}
      onPass={game.passTurn}
      onShuffle={game.shuffleRack}
      onToggleSwap={game.toggleTileForSwap}
      onSwap={game.swapTiles}
      onClearSwap={game.clearSwap}
      onClearError={game.clearError}
    />
  );
}