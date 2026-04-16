// export interface Vector2 {
//   x: number;
//   y: number;
// }

// export interface Paddle {
//   x: number;
//   y: number;
//   width: number;
//   height: number;
// }

// export interface Ball {
//   pos: Vector2;
//   vel: Vector2;
//   radius: number;
// }

// export interface Brick {
//   x: number;
//   y: number;
//   width: number;
//   height: number;
//   health: number; // можно использовать для прочных кирпичей
// }

// export interface GameState {
//   paddle: Paddle;
//   ball: Ball;
//   bricks: Brick[];
//   score: number;
//   lives: number;
//   gameOver: boolean;
//   win: boolean;
// }

export interface Vector2 {
  x: number;
  y: number;
}

export type GameMode = 'cube' | 'ship' | 'ball' | 'ufo' | 'wave';

export interface Player {
  pos: Vector2;           // позиция на canvas
  vel: Vector2;           // скорость
  size: number;           // размер (в пикселях)
  isGrounded: boolean;    // на земле ли?
  color: string;          // цвет (позже заменится спрайтом)
  mode: GameMode;         // текущий режим
  rotation: number;       // угол вращения (для анимации)
  gravity: number;        // текущая гравитация (может меняться)
  jumpForce: number;      // сила прыжка
}

export interface Obstacle {
  x: number;
  y: number;
  width: number;
  height: number;
  type: 'spike' | 'block';
}

export interface Portal {
  x: number;              // позиция по x (в игровом мире)
  mode: GameMode;         // в какой режим превращает
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;           // от 1 до 0, исчезает когда <=0
  color: string;
}

export interface GameState {
  player: Player;
  obstacles: Obstacle[];
  portals: Portal[];
  particles: Particle[];
  cameraX: number;        // смещение камеры (мир двигается, игрок стоит)
  score: number;
  gameOver: boolean;
  gameStarted: boolean;
  speed: number;          // базовая скорость уровня
}