// src/api/gameService.ts
// Même URL backend Railway que le frontend web.
import axios from 'axios';
import { GameState } from '../types';

const API_URL = 'https://scrabblefull-stack-production.up.railway.app/game';

export const startGame = async (
  playerNames: string[],
  difficulty: string = 'medium',
): Promise<GameState> => {
  const response = await axios.post(
    `${API_URL}/start?difficulty=${difficulty}`,
    playerNames,
  );
  return response.data;
};

export const getGameStatus = async (gameId: string): Promise<GameState> => {
  const response = await axios.get(`${API_URL}/status/${gameId}`);
  return response.data;
};

export const playWord = async (
  gameId: string,
  playerId: number,
  placements: [number, number, string][],
): Promise<GameState> => {
  const response = await axios.post(
    `${API_URL}/play/${gameId}?player_id=${playerId}`,
    placements,
  );
  return response.data.game_state;
};

export const passTurn = async (
  gameId: string,
  playerId: number,
): Promise<GameState> => {
  const response = await axios.post(
    `${API_URL}/pass/${gameId}?player_id=${playerId}`,
  );
  return response.data.game_state;
};

export const swapTiles = async (
  gameId: string,
  playerId: number,
  letters: string[],
): Promise<GameState> => {
  const response = await axios.post(
    `${API_URL}/swap/${gameId}?player_id=${playerId}`,
    letters,
  );
  return response.data.game_state;
};

export const shuffleRack = async (
  gameId: string,
  playerId: number,
): Promise<GameState> => {
  const response = await axios.post(
    `${API_URL}/shuffle/${gameId}?player_id=${playerId}`,
  );
  return response.data.game_state;
};

export const aiPlayTurn = async (gameId: string): Promise<GameState> => {
  const response = await axios.post(`${API_URL}/ai/play/${gameId}`);
  return response.data.game_state;
};

export const getDifficulties = async () => {
  const response = await axios.get(`${API_URL}/difficulties`);
  return response.data;
};