import { Vector2 } from './types'

export function generateId(): string {
  return Math.random().toString(36).substring(2, 9)
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}

export function rectRect(
  r1: { x: number; y: number; w: number; h: number },
  r2: { x: number; y: number; w: number; h: number }
): boolean {
  return r1.x < r2.x + r2.w && r1.x + r1.w > r2.x && r1.y < r2.y + r2.h && r1.y + r1.h > r2.y
}

// Проверка пересечения прямоугольника и треугольника (для спайка)
export function rectTriangle(
  rect: { x: number; y: number; w: number; h: number },
  tri: { p1: Vector2; p2: Vector2; p3: Vector2 }
): boolean {
  const minX = Math.min(tri.p1.x, tri.p2.x, tri.p3.x)
  const maxX = Math.max(tri.p1.x, tri.p2.x, tri.p3.x)
  const minY = Math.min(tri.p1.y, tri.p2.y, tri.p3.y)
  const maxY = Math.max(tri.p1.y, tri.p2.y, tri.p3.y)
  if (!rectRect(rect, { x: minX, y: minY, w: maxX - minX, h: maxY - minY })) return false

  const points = [
    { x: rect.x, y: rect.y },
    { x: rect.x + rect.w, y: rect.y },
    { x: rect.x, y: rect.y + rect.h },
    { x: rect.x + rect.w, y: rect.y + rect.h }
  ]
  for (let p of points) {
    if (pointInTriangle(p, tri.p1, tri.p2, tri.p3)) return true
  }
  return false
}

function pointInTriangle(p: Vector2, a: Vector2, b: Vector2, c: Vector2): boolean {
  const v0 = { x: c.x - a.x, y: c.y - a.y }
  const v1 = { x: b.x - a.x, y: b.y - a.y }
  const v2 = { x: p.x - a.x, y: p.y - a.y }
  const dot00 = v0.x * v0.x + v0.y * v0.y
  const dot01 = v0.x * v1.x + v0.y * v1.y
  const dot02 = v0.x * v2.x + v0.y * v2.y
  const dot11 = v1.x * v1.x + v1.y * v1.y
  const dot12 = v1.x * v2.x + v1.y * v2.y
  const invDenom = 1 / (dot00 * dot11 - dot01 * dot01)
  const u = (dot11 * dot02 - dot01 * dot12) * invDenom
  const v = (dot00 * dot12 - dot01 * dot02) * invDenom
  return u >= 0 && v >= 0 && u + v <= 1
}
