// import { Vector2 } from '../types';

// export interface Particle {
//   position: Vector2;
//   velocity: Vector2;
//   life: number;
//   maxLife: number;
//   size: number;
//   color: string;
// }

// export class ParticleSystem {
//   private particles: Particle[] = [];
//   private pool: Particle[] = [];

//   constructor(private maxParticles: number = 100) {}

//   emit(pos: Vector2, count: number, color: string = '#fff'): void {
//     for (let i = 0; i < count; i++) {
//       let p: Particle;
//       if (this.pool.length > 0) {
//         p = this.pool.pop()!;
//       } else if (this.particles.length < this.maxParticles) {
//         p = { position: { x: 0, y: 0 }, velocity: { x: 0, y: 0 }, life: 0, maxLife: 1, size: 2, color };
//       } else {
//         p = this.particles[0];
//         this.particles.shift();
//       }
//       p.position.x = pos.x + (Math.random() - 0.5) * 10;
//       p.position.y = pos.y + (Math.random() - 0.5) * 10;
//       p.velocity.x = (Math.random() - 0.5) * 3;
//       p.velocity.y = (Math.random() - 0.5) * 3 - 2;
//       p.life = p.maxLife = 0.5 + Math.random() * 0.5;
//       p.size = 2 + Math.random() * 3;
//       p.color = color;
//       this.particles.push(p);
//     }
//   }

//   update(dt: number): void {
//     for (let i = this.particles.length - 1; i >= 0; i--) {
//       const p = this.particles[i];
//       p.life -= dt;
//       if (p.life <= 0) {
//         this.particles.splice(i, 1);
//         this.pool.push(p);
//         continue;
//       }
//       p.position.x += p.velocity.x * dt * 60;
//       p.position.y += p.velocity.y * dt * 60;
//     }
//   }

//   render(ctx: CanvasRenderingContext2D, cameraX: number): void {
//     ctx.save();
//     ctx.translate(-cameraX, 0);
//     for (let p of this.particles) {
//       ctx.globalAlpha = p.life / p.maxLife;
//       ctx.fillStyle = p.color;
//       ctx.fillRect(p.position.x - p.size/2, p.position.y - p.size/2, p.size, p.size);
//     }
//     ctx.restore();
//     ctx.globalAlpha = 1.0;
//   }

//   clear(): void {
//     this.particles = [];
//     this.pool = [];
//   }
// }