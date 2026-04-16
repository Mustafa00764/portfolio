// import { CANVAS_WIDTH } from '../constants'

// export class Camera {
//   public x: number = 0
//   public targetX: number = 0

//   constructor(private width: number = CANVAS_WIDTH) {}

//   update(targetX: number, deadzone: number = 100): void {
//     const desiredX = targetX - this.width / 2
//     this.targetX = desiredX
//     this.x += (this.targetX - this.x) * 0.1
//   }

//   getX(): number {
//     return this.x
//   }
// }