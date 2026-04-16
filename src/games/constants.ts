export const CANVAS_WIDTH = 800;
export const CANVAS_HEIGHT = 400;
export const GROUND_Y = 350;
export const PLAYER_SIZE = 30;
export const PLAYER_START_X = 100;
export const PLAYER_START_Y = GROUND_Y - PLAYER_SIZE;
export const GRAVITY = 0.5;
export const JUMP_FORCE = -10;
export const MAX_SPEED_Y = 15;
export const LEVEL_SPEED = 3;
export const CAMERA_DEADZONE_X = 200;
export const FIXED_TIMESTEP = 1000 / 60; // 60 FPS physics
export const PLAYER_COLOR = '#ff0';
export const OBSTACLE_COLORS = {
  spike: '#f00',
  block: '#888',
  moving: '#0ff',
};
export const GROUND_COLOR = '#333';
export const BG_COLOR = '#222';