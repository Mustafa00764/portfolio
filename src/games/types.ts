export interface Vector2 {
  x: number;
  y: number;
}

export interface Player {
  position: Vector2;
  velocity: Vector2;
  width: number;
  height: number;
  onGround: boolean;
  alive: boolean;
}

export type ObstacleType = 'spike' | 'block' | 'moving';

export interface Obstacle {
  id: string;
  type: ObstacleType;
  position: Vector2;
  width: number;
  height: number;
  velocity?: Vector2;
}

export interface LevelData {
  id: number;
  name: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  length: number; // in seconds
  obstacles: Omit<Obstacle, 'id'>[];
}

export interface GameState {
  player: Player;
  obstacles: Obstacle[];
  cameraX: number;
  levelLength: number;
  progress: number;
  attempts: number;
  bestProgress: number;
  gameOver: boolean;
  victory: boolean;
  paused: boolean;
}

export interface AudioManagerInterface {
  init(): void;
  playMusic(trackId: number): void;
  stopMusic(): void;
  setMusicVolume(vol: number): void;
  setSFXVolume(vol: number): void;
  setMasterVolume(vol: number): void;
  playSFX(sfx: 'jump' | 'death' | 'click' | 'win'): void;
}