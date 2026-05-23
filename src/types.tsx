// src/types.ts

export interface Tile {
  letter: string;
  score: number;
}

export interface Player {
  id: number;
  name: string;
  score: number;
  rack: Tile[];
  is_ai: boolean;
}

export interface Board {
  grid: (Tile | null)[][];
}

export type GameStatus = 'SETUP' | 'ACTIVE' | 'FINISHED';

export interface GameState {
  game_id: string;
  board: Board;
  players: Player[];
  current_player_index: number;
  remaining_tiles: string[];
  passes_count: number;
  status: GameStatus;
  winner_name: string | null;
}

// Tuile posée temporairement sur le plateau (pas encore validée)
export interface Placement {
  letter: string;
  r: number;
  c: number;
  originalTile: Tile;
  rackIndex: number;
}