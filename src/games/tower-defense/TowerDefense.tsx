import React, { useEffect, useMemo, useRef, useState } from 'react'
import styles from './TowerDefense.module.css'

import {
  THEME_ASSETS,
  DEFENDER_VISUALS,
  ENEMY_VISUALS,
  type VisualAssetConfig
} from '@components/tower-defense/game/assets'
import {
  type AnimationState,
  createAnimationController,
  setAnimationState,
  getAnimationFrameIndex,
  isAnimationFinished
} from '@components/tower-defense/game/animation'
import {
  collectAllAssetPaths,
  loadImagesMap,
  type LoadedImageMap,
  collision
} from '@components/tower-defense/game/helpers'

type DefenderTypeKey =
  | 'sunflower'
  | 'pea'
  | 'tank'
  | 'sniper'
  | 'rapid'
  | 'frost'
  | 'healer'
  | 'fan'
type EnemyTypeKey =
  | 'walker'
  | 'runner'
  | 'ghoul'
  | 'brute'
  | 'elite'
  | 'arsonist'
  | 'ranged'
  | 'boss'
type GameModeKey = 'normal' | 'medium' | 'hard' | 'endless'
type ToolMode = 'plant' | 'shovel'

interface DefenderTypeConfig {
  key: DefenderTypeKey
  name: string
  color: string
  cost: number
  maxHealth: number
  damage: number
  fireRate: number
  projectileSpeed: number
  projectileRadius: number
  description: string
  slowPower?: number
  healPower?: number
  isWall?: boolean
  sunProductionRate?: number
  sunProductionAmount?: number
  attackDelayMs?: number
  knockbackPower?: number
  knockbackRange?: number
  knockbackDirection?: 'away' | 'toward'
  attackDurationMs?: number
}

interface EnemyTypeConfig {
  key: EnemyTypeKey
  name: string
  color: string
  maxHealth: number
  damage: number
  speed: number
  level: number
  reward: number
  attackRate: number
  isBoss?: boolean
  canJump?: boolean
  isRanged?: boolean
  rangedDamage?: number
  laneSwapCooldown?: number
}

interface GameModeConfig {
  key: GameModeKey
  label: string
  startResources: number
  enemyHealthMultiplier: number
  enemyDamageMultiplier: number
  eliteChance: number
  endless: boolean
  description: string
  wavesPerCycle: number
  bossDefaultWaves: number[]
}

interface PendingSpawn {
  frame: number
  enemyType: EnemyTypeKey
  lane: number
}

interface MouseState {
  x: number
  y: number
  width: number
  height: number
  active: boolean
}

interface HoverCell {
  x: number
  y: number
  width: number
  height: number
  valid: boolean
}

interface ThreatPreview {
  lane: number
  enemyType: EnemyTypeKey
  framesLeft: number
}

interface WaveMeta {
  totalSpawns: number
  durationFrames: number
}

const GAME_MODES: Record<GameModeKey, GameModeConfig> = {
  normal: {
    key: 'normal',
    label: 'Normal',
    startResources: 10000,
    enemyHealthMultiplier: 1,
    enemyDamageMultiplier: 1,
    eliteChance: 0.08,
    endless: false,
    description: 'Комфортная сложность.',
    wavesPerCycle: 5,
    bossDefaultWaves: [4, 5]
  },
  medium: {
    key: 'medium',
    label: 'Medium',
    startResources: 280,
    enemyHealthMultiplier: 1.18,
    enemyDamageMultiplier: 1.12,
    eliteChance: 0.14,
    endless: false,
    description: 'Чуть меньше ресурсов и сильнее волны.',
    wavesPerCycle: 5,
    bossDefaultWaves: [4, 5]
  },
  hard: {
    key: 'hard',
    label: 'Hard',
    startResources: 10000,
    enemyHealthMultiplier: 1.42,
    enemyDamageMultiplier: 1.28,
    eliteChance: 0.22,
    endless: false,
    description: 'Плотные и агрессивные волны.',
    wavesPerCycle: 5,
    bossDefaultWaves: [3, 4, 5]
  },
  endless: {
    key: 'endless',
    label: 'Endless',
    startResources: 320,
    enemyHealthMultiplier: 1,
    enemyDamageMultiplier: 1,
    eliteChance: 0.16,
    endless: true,
    description: 'Циклические волны без конца.',
    wavesPerCycle: 5,
    bossDefaultWaves: [4, 5]
  }
}

const DEFENDER_TYPES: Record<DefenderTypeKey, DefenderTypeConfig> = {
  sunflower: {
    key: 'sunflower',
    name: 'Sunflower',
    color: '#ffd54f',
    cost: 50,
    maxHealth: 90,
    damage: 0,
    fireRate: 0,
    projectileSpeed: 0,
    projectileRadius: 0,
    description: 'Генерирует солнце.',
    sunProductionRate: 450,
    sunProductionAmount: 25
  },
  pea: {
    key: 'pea',
    name: 'Pea',
    color: '#52c85f',
    cost: 100,
    maxHealth: 100,
    damage: 20,
    fireRate: 160,
    projectileSpeed: 12,
    projectileRadius: 8,
    description: 'Базовая дальняя атака.',
    attackDelayMs: 500
  },
  tank: {
    key: 'tank',
    name: 'Wall',
    color: '#a87a45',
    cost: 50,
    maxHealth: 500,
    damage: 0,
    fireRate: 999999,
    projectileSpeed: 0,
    projectileRadius: 0,
    description: 'Чистая стена. Не стреляет.',
    isWall: true
  },
  sniper: {
    key: 'sniper',
    name: 'Sniper',
    color: '#8e63ff',
    cost: 175,
    maxHealth: 90,
    damage: 50,
    fireRate: 200,
    projectileSpeed: 30,
    projectileRadius: 15,
    description: 'Редко, но очень больно бьёт.',
    attackDelayMs: 1700
  },
  rapid: {
    key: 'rapid',
    name: 'Rapid',
    color: '#ffa726',
    cost: 150,
    maxHealth: 85,
    damage: 5,
    fireRate: 12,
    projectileSpeed: 20,
    projectileRadius: 6,
    description: 'Частые выстрелы.',
    attackDelayMs: 90
  },
  frost: {
    key: 'frost',
    name: 'Frost',
    color: '#59c3ff',
    cost: 175,
    maxHealth: 95,
    damage: 20,
    fireRate: 120,
    projectileSpeed: 12,
    projectileRadius: 25,
    slowPower: 0.5,
    description: 'Замедляет врагов.',
    attackDelayMs: 1550
  },
  healer: {
    key: 'healer',
    name: 'Bloom',
    color: '#ff77aa',
    cost: 125,
    maxHealth: 110,
    damage: 0,
    fireRate: 70,
    projectileSpeed: 0,
    projectileRadius: 0,
    healPower: 10,
    description: 'Лечит союзников.'
  },
  fan: {
    key: 'fan',
    name: 'Fan',
    color: '#a5d6a5',
    cost: 150,
    maxHealth: 120,
    damage: 0,
    fireRate: 200,
    projectileSpeed: 0,
    projectileRadius: 0,
    description: 'Плавно отталкивает врагов назад.',
    knockbackPower: 10,
    knockbackRange: 300,
    knockbackDirection: 'away',
    attackDelayMs: 900,
    attackDurationMs: 1500
  }
}

const ENEMY_TYPES: Record<EnemyTypeKey, EnemyTypeConfig> = {
  walker: {
    key: 'walker',
    name: 'Walker',
    color: '#9e9e9e',
    maxHealth: 100,
    damage: 8,
    speed: 0.4,
    level: 1,
    reward: 10,
    attackRate: 45
  },
  runner: {
    key: 'runner',
    name: 'Runner',
    color: '#ff7043',
    maxHealth: 72,
    damage: 7,
    speed: 1,
    level: 1,
    reward: 9,
    attackRate: 38
  },
  ghoul: {
    key: 'ghoul',
    name: 'Ghoul',
    color: '#ef5350',
    maxHealth: 150,
    damage: 12,
    speed: 0.5,
    level: 2,
    reward: 15,
    attackRate: 36
  },
  brute: {
    key: 'brute',
    name: 'Brute',
    color: '#7e57c2',
    maxHealth: 300,
    damage: 22,
    speed: 0.26,
    level: 1,
    reward: 24,
    attackRate: 28
  },
  elite: {
    key: 'elite',
    name: 'Elite',
    color: '#263238',
    maxHealth: 390,
    damage: 30,
    speed: 0.35,
    level: 4,
    reward: 35,
    attackRate: 24
  },
  arsonist: {
    key: 'arsonist',
    name: 'arsonist',
    color: '#ab47bc',
    maxHealth: 160,
    damage: 16,
    speed: 0.52,
    level: 3,
    reward: 18,
    attackRate: 30,
    canJump: true
  },
  ranged: {
    key: 'ranged',
    name: 'Ranged',
    color: '#5c6bc0',
    maxHealth: 130,
    damage: 10,
    speed: 0.42,
    level: 3,
    reward: 20,
    attackRate: 42,
    isRanged: true,
    rangedDamage: 6
  },
  boss: {
    key: 'boss',
    name: 'Boss',
    color: '#3e2723',
    maxHealth: 1200,
    damage: 42,
    speed: 0.22,
    level: 8,
    reward: 120,
    attackRate: 18,
    isBoss: true,
    laneSwapCooldown: 260
  }
}

class Cell {
  x: number
  y: number
  width: number
  height: number

  constructor(x: number, y: number, cellSize: number) {
    this.x = x
    this.y = y
    this.width = cellSize
    this.height = cellSize
  }
}

class Projectile {
  x: number
  y: number
  radius: number
  power: number
  speed: number
  color: string
  width: number
  height: number
  slowPower?: number

  constructor(
    x: number,
    y: number,
    power: number,
    speed: number,
    radius: number,
    color: string,
    slowPower?: number
  ) {
    this.x = x
    this.y = y
    this.radius = radius
    this.power = power
    this.speed = speed
    this.color = color
    this.width = radius * 2
    this.height = radius * 2
    this.slowPower = slowPower
  }

  update() {
    this.x += this.speed
  }

  draw(ctx: CanvasRenderingContext2D) {
    const glow = ctx.createRadialGradient(this.x, this.y, 1, this.x, this.y, this.radius + 4)
    glow.addColorStop(0, '#fffef8')
    glow.addColorStop(1, this.color)
    ctx.fillStyle = glow
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
    ctx.fill()
  }
}

class Sun {
  x: number
  y: number
  targetY: number
  radius: number
  amount: number
  speedY: number
  settled: boolean
  width: number
  height: number
  createdAtMs: number
  expiresAtMs: number

  constructor(
    x: number,
    startY: number,
    targetY: number,
    amount = 25,
    settledInitially = false,
    createdAtMs = 0
  ) {
    this.x = x
    this.y = startY
    this.targetY = targetY
    this.radius = 22
    this.amount = amount
    this.speedY = 1.15
    this.settled = settledInitially
    this.width = this.radius * 2
    this.height = this.radius * 2
    this.createdAtMs = createdAtMs
    this.expiresAtMs = createdAtMs + 15000
  }

  update() {
    if (!this.settled) {
      this.y += this.speedY
      if (this.y >= this.targetY) {
        this.y = this.targetY
        this.settled = true
      }
    }
  }

  isExpired(gameTimeMs: number) {
    return gameTimeMs >= this.expiresAtMs
  }

  draw(ctx: CanvasRenderingContext2D) {
    const gradient = ctx.createRadialGradient(this.x, this.y, 4, this.x, this.y, this.radius)
    gradient.addColorStop(0, '#fffde7')
    gradient.addColorStop(1, '#ffd54f')

    ctx.fillStyle = gradient
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
    ctx.fill()

    ctx.strokeStyle = 'rgba(255,255,255,0.8)'
    ctx.lineWidth = 2

    for (let i = 0; i < 8; i++) {
      const angle = (Math.PI * 2 * i) / 8
      ctx.beginPath()
      ctx.moveTo(
        this.x + Math.cos(angle) * (this.radius + 3),
        this.y + Math.sin(angle) * (this.radius + 3)
      )
      ctx.lineTo(
        this.x + Math.cos(angle) * (this.radius + 11),
        this.y + Math.sin(angle) * (this.radius + 11)
      )
      ctx.stroke()
    }
  }
}

class LawnMower {
  x: number
  y: number
  width: number
  height: number
  laneY: number
  active: boolean
  triggered: boolean
  speed: number

  constructor(laneY: number, cellSize: number, lawnStripWidth: number) {
    this.width = 44
    this.height = 34
    this.x = (lawnStripWidth - this.width) / 2
    this.y = laneY + cellSize / 2 - this.height / 2
    this.laneY = laneY
    this.active = true
    this.triggered = false
    this.speed = 9
  }

  update() {
    if (this.triggered) this.x += this.speed
  }

  draw(ctx: CanvasRenderingContext2D) {
    if (!this.active) return

    ctx.fillStyle = '#c62828'
    ctx.beginPath()
    ctx.roundRect(this.x, this.y, this.width, this.height, 10)
    ctx.fill()

    ctx.fillStyle = '#263238'
    ctx.beginPath()
    ctx.arc(this.x + 10, this.y + this.height, 6, 0, Math.PI * 2)
    ctx.arc(this.x + 34, this.y + this.height, 6, 0, Math.PI * 2)
    ctx.fill()
  }
}

interface DefenderRuntimeAnimation {
  currentState: AnimationState
  stateStartedAtMs: number
}

const isWalkState = (s: AnimationState) => s === 'idle' || s === 'damage60' || s === 'damage30'

class Defender {
  x: number
  y: number
  width: number
  height: number
  typeKey: DefenderTypeKey
  name: string
  color: string
  shooting: boolean
  health: number
  maxHealth: number
  damage: number
  fireRate: number
  projectileSpeed: number
  projectileRadius: number
  shootTimer: number
  slowPower?: number
  healPower?: number
  isWall: boolean
  sunProductionRate?: number
  sunProductionAmount?: number
  flashAttack: number
  deathTimer: number
  isDying: boolean
  nextSunProductionAtMs: number | null
  animation: DefenderRuntimeAnimation
  lastHurtAtMs: number
  attackLockUntilMs: number
  attackDelayMs: number
  attackDurationMs: number
  pendingShot: boolean
  scheduledShotTimeMs: number
  knockbackPower?: number
  knockbackRange?: number
  knockbackDirection?: 'away' | 'toward'

  resumeState: AnimationState | null = null
  resumeTimeElapsed: number = 0

  constructor(x: number, y: number, cellSize: number, cellGap: number, config: DefenderTypeConfig) {
    this.x = x
    this.y = y
    this.width = cellSize - cellGap * 2
    this.height = cellSize - cellGap * 2
    this.typeKey = config.key
    this.name = config.name
    this.color = config.color
    this.shooting = false
    this.health = config.maxHealth
    this.maxHealth = config.maxHealth
    this.damage = config.damage
    this.fireRate = config.fireRate
    this.projectileSpeed = config.projectileSpeed
    this.projectileRadius = config.projectileRadius
    this.shootTimer = config.fireRate
    this.slowPower = config.slowPower
    this.healPower = config.healPower
    this.isWall = !!config.isWall
    this.sunProductionRate = config.sunProductionRate
    this.sunProductionAmount = config.sunProductionAmount
    this.flashAttack = 0
    this.deathTimer = 0
    this.isDying = false
    this.nextSunProductionAtMs = null
    this.animation = createAnimationController()
    this.lastHurtAtMs = -999999
    this.attackLockUntilMs = -999999
    this.attackDelayMs = config.attackDelayMs ?? 0
    this.attackDurationMs = config.attackDurationMs ?? this.getDefaultAttackDurationMs()
    this.pendingShot = false
    this.scheduledShotTimeMs = 0
    this.knockbackPower = config.knockbackPower
    this.knockbackRange = config.knockbackRange
    this.knockbackDirection = config.knockbackDirection
    this.resumeState = null
    this.resumeTimeElapsed = 0
  }

  private getDefaultAttackDurationMs(): number {
    const visuals = DEFENDER_VISUALS[this.typeKey]
    if (!visuals) return 220
    const clip = visuals.states['attack']
    if (!clip || clip.frames.length === 0) return 220
    const fps = clip.fps ?? 10
    return (clip.frames.length / fps) * 1000
  }

  public getHurtAnimationDurationMs(): number {
    const visuals = DEFENDER_VISUALS[this.typeKey]
    if (!visuals) return 0
    const clip = visuals.states['hurt']
    if (!clip || clip.frames.length === 0) return 0
    const fps = clip.fps ?? 10
    return (clip.frames.length / fps) * 1000
  }

  update(state: GameStateData, nowMs: number) {
    if (this.isDying) {
      this.deathTimer++
      return
    }

    if (state.waitingForFirstPlant) return

    if (this.flashAttack > 0) this.flashAttack--

    // Обработка запланированных выстрелов (задержка анимации)
    if (this.pendingShot && nowMs + 0.1 >= this.scheduledShotTimeMs) {
      if (this.typeKey === 'fan') {
        const range = this.knockbackRange ?? 200
        const power = this.knockbackPower ?? 80
        const direction = this.knockbackDirection ?? 'away'
        for (const enemy of state.enemies) {
          if (enemy.isDying) continue
          if (Math.abs(enemy.y - this.y) > this.height) continue
          if (enemy.x <= this.x || enemy.x - this.x > range) continue
          if (direction === 'away') enemy.pushForce += power
          else enemy.pushForce -= power
        }
        this.flashAttack = 10
      } else {
        state.projectiles.push(
          new Projectile(
            this.x + this.width - 8,
            this.y + this.height / 2,
            this.damage,
            this.projectileSpeed,
            this.projectileRadius,
            this.color,
            this.slowPower
          )
        )
        this.flashAttack = 10
      }
      this.pendingShot = false
    }

    if (this.isWall) return

    if (this.typeKey === 'sunflower') {
      if (!this.sunProductionRate) return
      const intervalMs = (this.sunProductionRate / 90) * 1000

      if (this.nextSunProductionAtMs === null) {
        this.nextSunProductionAtMs = nowMs + intervalMs
      }

      while (nowMs >= this.nextSunProductionAtMs) {
        const padding = 14
        const minX = this.x + padding
        const maxX = this.x + this.width - padding
        const minY = this.y + padding
        const maxY = this.y + this.height - padding

        const randomX = minX + Math.random() * Math.max(1, maxX - minX)
        const randomY = minY + Math.random() * Math.max(1, maxY - minY)

        state.suns.push(
          new Sun(randomX, randomY, randomY, this.sunProductionAmount ?? 25, true, nowMs)
        )

        this.nextSunProductionAtMs += intervalMs
      }
      return
    }

    if (this.typeKey === 'healer') {
      this.shootTimer++
      if (this.shootTimer >= this.fireRate) {
        const allies = state.defenders.filter(d => d.y === this.y && d !== this && !d.isDying)
        allies.forEach(def => {
          def.health = Math.min(def.maxHealth, def.health + (this.healPower ?? 0))
        })
        this.flashAttack = 10
        this.attackLockUntilMs = nowMs + this.attackDurationMs
        this.shootTimer = 0
        this.animation.stateStartedAtMs = nowMs
      }
      return
    }

    if (this.typeKey === 'fan') {
      const range = this.knockbackRange ?? 200
      const delay = this.attackDelayMs ?? 0
      const enemiesInRange = state.enemies.some(
        enemy =>
          !enemy.isDying &&
          Math.abs(enemy.y - this.y) < this.height &&
          enemy.x > this.x &&
          enemy.x - this.x <= range
      )
      this.shooting = enemiesInRange

      if (this.shooting) {
        this.shootTimer++
        if (this.shootTimer >= this.fireRate && !this.pendingShot) {
          this.pendingShot = true
          this.scheduledShotTimeMs = nowMs + delay
          this.attackLockUntilMs = nowMs + Math.max(this.attackDurationMs, delay)
          this.shootTimer = 0
          this.animation.stateStartedAtMs = nowMs
        }
      } else {
        this.shootTimer = this.fireRate
        this.pendingShot = false
      }
      return
    }

    if (this.shooting) {
      if (!this.pendingShot) {
        this.shootTimer++
      }

      if (this.shootTimer >= this.fireRate) {
        if (this.attackDelayMs > 0 && !this.pendingShot) {
          this.pendingShot = true
          this.scheduledShotTimeMs = nowMs + this.attackDelayMs
          // 🔥 Запираем анимацию, чтобы она дождалась пули (исправляет проблему снайпера)
          this.attackLockUntilMs = nowMs + Math.max(this.attackDurationMs, this.attackDelayMs)
          this.flashAttack = 10
          this.shootTimer = 0
          // 🔥 Принудительно начинаем анимацию атаки с начала
          this.animation.stateStartedAtMs = nowMs
        } else if (this.attackDelayMs === 0) {
          state.projectiles.push(
            new Projectile(
              this.x + this.width - 8,
              this.y + this.height / 2,
              this.damage,
              this.projectileSpeed,
              this.projectileRadius,
              this.color,
              this.slowPower
            )
          )
          this.flashAttack = 10
          this.attackLockUntilMs = nowMs + this.attackDurationMs
          this.shootTimer = 0
          this.animation.stateStartedAtMs = nowMs
        }
      }
    } else {
      this.shootTimer = this.fireRate
      this.pendingShot = false
    }
  }

  startDeath(nowMs?: number) {
    this.isDying = true
    this.deathTimer = 0
    this.pendingShot = false
    if (nowMs !== undefined) {
      this.animation.currentState = 'death'
      this.animation.stateStartedAtMs = nowMs
    }
  }
}

interface EnemyRuntimeAnimation {
  currentState: AnimationState
  stateStartedAtMs: number
}

class Enemy {
  x: number
  y: number
  width: number
  height: number
  typeKey: EnemyTypeKey
  name: string
  color: string
  speed: number
  movement: number
  damage: number
  health: number
  maxHealth: number
  level: number
  reward: number
  attackRate: number
  attackTimer: number
  isBoss: boolean
  canJump: boolean
  isRanged: boolean
  rangedDamage: number
  slowFactor: number
  slowTimer: number
  deathTimer: number
  isDying: boolean
  animation: EnemyRuntimeAnimation
  lastHurtAtMs: number
  pushForce: number
  pushFriction: number
  attackLockUntilMs: number
  deathAnimationDurationMs: number

  attackDelayMs: number
  attackStartedAtMs: number
  isEating: boolean

  resumeState: AnimationState | null = null
  resumeTimeElapsed: number = 0

  constructor(
    laneY: number,
    cellSize: number,
    cellGap: number,
    canvasWidth: number,
    config: EnemyTypeConfig,
    hpMult = 1,
    dmgMult = 1
  ) {
    this.x = canvasWidth
    this.y = laneY
    this.width = cellSize - cellGap * 2
    this.height = cellSize - cellGap * 2
    this.typeKey = config.key
    this.name = config.name
    this.color = config.color
    this.speed = config.speed
    this.movement = config.speed
    this.damage = config.damage * dmgMult
    this.health = config.maxHealth * hpMult
    this.maxHealth = config.maxHealth * hpMult
    this.level = config.level
    this.reward = config.reward
    this.attackRate = config.attackRate
    this.attackTimer = 0
    this.isBoss = !!config.isBoss
    this.canJump = !!config.canJump
    this.isRanged = !!config.isRanged
    this.rangedDamage = config.rangedDamage ?? 0
    this.slowFactor = 1
    this.slowTimer = 0
    this.deathTimer = 0
    this.isDying = false
    this.animation = createAnimationController()
    this.lastHurtAtMs = -999999
    this.pushForce = 0
    this.pushFriction = 0.9
    this.attackLockUntilMs = -999999
    this.deathAnimationDurationMs = this.getDeathAnimationDurationMs()

    this.attackDelayMs = 400
    this.attackStartedAtMs = 0
    this.isEating = false
    this.resumeState = null
    this.resumeTimeElapsed = 0
  }

  private getDeathAnimationDurationMs(): number {
    const visuals = ENEMY_VISUALS[this.typeKey]
    if (!visuals) return 300
    const clip = visuals.states['death']
    if (!clip || clip.frames.length === 0) return 300
    const fps = clip.fps ?? 10
    return (clip.frames.length / fps) * 1000
  }

  public getHurtAnimationDurationMs(): number {
    const visuals = ENEMY_VISUALS[this.typeKey]
    if (!visuals) return 0
    const clip = visuals.states['hurt']
    if (!clip || clip.frames.length === 0) return 0
    const fps = clip.fps ?? 10
    return (clip.frames.length / fps) * 1000
  }

  public getAttackAnimationDurationMs(): number {
    const visuals = ENEMY_VISUALS[this.typeKey]
    if (!visuals) return 1000
    const clip = visuals.states['attack']
    if (!clip || clip.frames.length === 0) return 1000
    const fps = clip.fps ?? 10
    return (clip.frames.length / fps) * 1000
  }

  update() {
    if (this.isDying) {
      this.deathTimer++
      return
    }

    if (this.slowTimer > 0) this.slowTimer--
    else this.slowFactor = 1

    if (!this.isEating) {
      this.x -= this.movement * this.slowFactor
    }

    this.x += this.pushForce
    this.pushForce *= this.pushFriction
  }

  applySlow(power: number) {
    this.slowFactor = Math.min(this.slowFactor, power)
    this.slowTimer = 80
  }

  startDeath(nowMs?: number) {
    this.isDying = true
    this.deathTimer = 0
    this.movement = 0
    this.attackLockUntilMs = -999999
    this.isEating = false

    if (nowMs !== undefined) {
      this.animation.currentState = 'death'
      this.animation.stateStartedAtMs = nowMs
    }
  }
}

class Boss extends Enemy {
  laneSwapCooldown: number
  laneSwapTimer: number
  targetLaneY: number
  moveVerticalSpeed: number

  constructor(
    laneY: number,
    cellSize: number,
    cellGap: number,
    canvasWidth: number,
    config: EnemyTypeConfig,
    hpMult = 1,
    dmgMult = 1
  ) {
    super(laneY, cellSize, cellGap, canvasWidth, config, hpMult, dmgMult)
    this.laneSwapCooldown = config.laneSwapCooldown ?? 240
    this.laneSwapTimer = 0
    this.targetLaneY = laneY
    this.moveVerticalSpeed = 2.6
  }

  decideLane(state: GameStateData) {
    if (this.isDying) return
    if (this.laneSwapTimer < this.laneSwapCooldown) {
      this.laneSwapTimer++
      return
    }

    this.laneSwapTimer = 0
    const currentIndex = state.laneYs.findIndex(v => Math.abs(v - this.targetLaneY) < 1)
    const candidateIndexes = [currentIndex - 1, currentIndex, currentIndex + 1].filter(
      idx => idx >= 0 && idx < state.laneYs.length
    )

    let bestLaneY = this.targetLaneY
    let bestScore = Infinity

    for (const idx of candidateIndexes) {
      const laneY = state.laneYs[idx]
      const defendersOnLane = state.defenders.filter(
        d => Math.abs(d.y - laneY) < 18 && !d.isDying
      ).length
      if (defendersOnLane < bestScore) {
        bestScore = defendersOnLane
        bestLaneY = laneY
      }
    }

    this.targetLaneY = bestLaneY
  }

  update() {
    super.update()
    if (this.isDying) return

    if (Math.abs(this.y - this.targetLaneY) > 1) {
      if (this.y < this.targetLaneY) this.y += this.moveVerticalSpeed
      else this.y -= this.moveVerticalSpeed
    }
  }
}

interface GameStateData {
  ctx: CanvasRenderingContext2D | null
  canvasWidth: number
  canvasHeight: number
  cellSize: number
  cellGap: number
  topBarHeight: number
  lawnStripWidth: number
  laneCount: number
  laneYs: number[]
  numberOfResources: number
  frame: number
  gameOver: boolean
  victory: boolean
  paused: boolean
  score: number
  bestScore: number
  waveNumber: number
  cycleNumber: number
  wavesPerCycle: number
  currentWaveLabel: string
  gameGrid: Cell[]
  defenders: Defender[]
  enemies: (Enemy | Boss)[]
  projectiles: Projectile[]
  suns: Sun[]
  lawnMowers: LawnMower[]
  pendingSpawns: PendingSpawn[]
  mouse: MouseState
  hoverCell: HoverCell
  modeKey: GameModeKey
  modeConfig: GameModeConfig
  endlessDifficultyScale: number
  bossActive: boolean
  waveMeta: WaveMeta
  endlessTimerFrames: number
  flagsEarned: number
  removalsLeft: number
  selectedTool: ToolMode
  threatPreview: ThreatPreview[]
  bossWaveOverrides: number[]
  bossWaves: number[]
  images: LoadedImageMap
  waitingForFirstPlant: boolean
  logicAccumulatorMs: number
  gameTimeMs: number
}

const TowerDefense: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationFrameRef = useRef<number>(0)
  const previousTimestampRef = useRef<number | null>(null)

  const [selectedDefender, setSelectedDefender] = useState<DefenderTypeKey>('pea')
  const [selectedMode, setSelectedMode] = useState<GameModeKey>('normal')
  const [, setUiTick] = useState(0)

  const gameState = useRef<GameStateData>({
    ctx: null,
    canvasWidth: 1260,
    canvasHeight: 760,
    cellSize: 90,
    cellGap: 4,
    topBarHeight: 120,
    lawnStripWidth: 70,
    laneCount: 7,
    laneYs: [],
    numberOfResources: 350,
    frame: 0,
    gameOver: false,
    victory: false,
    paused: false,
    score: 0,
    bestScore: 0,
    waveNumber: 1,
    cycleNumber: 1,
    wavesPerCycle: 5,
    currentWaveLabel: 'Click on the field to start',
    gameGrid: [],
    defenders: [],
    enemies: [],
    projectiles: [],
    suns: [],
    lawnMowers: [],
    pendingSpawns: [],
    mouse: { x: 0, y: 0, width: 2, height: 2, active: false },
    hoverCell: { x: 0, y: 0, width: 0, height: 0, valid: false },
    modeKey: 'normal',
    modeConfig: GAME_MODES.normal,
    endlessDifficultyScale: 1,
    bossActive: false,
    waveMeta: { totalSpawns: 0, durationFrames: 1 },
    endlessTimerFrames: 0,
    flagsEarned: 0,
    removalsLeft: 3,
    selectedTool: 'plant',
    threatPreview: [],
    bossWaveOverrides: [4, 5],
    bossWaves: [],
    images: {},
    waitingForFirstPlant: true,
    logicAccumulatorMs: 0,
    gameTimeMs: 0
  })

  const getVisualScaleRect = (
    x: number,
    y: number,
    width: number,
    height: number,
    visuals: VisualAssetConfig
  ) => {
    const widthScale = visuals.widthScale ?? 1
    const heightScale = visuals.heightScale ?? 1
    const anchorX = visuals.anchorX ?? 0.5
    const anchorY = visuals.anchorY ?? 1

    const drawWidth = width * widthScale
    const drawHeight = height * heightScale

    const baseX = x + width
    const baseY = y + height

    const drawX = baseX - drawWidth + anchorX
    const drawY = baseY - drawHeight + anchorY

    return { drawX, drawY, drawWidth, drawHeight }
  }

  // 🔥 ИСПРАВЛЕНИЕ: Анимация привязана строго к окну атаки (attackLockUntilMs), а не к факту наличия врага
  const getDefenderVisualState = (def: Defender, nowMs: number): AnimationState => {
    if (def.isDying) return 'death'

    // Защитник будет в 'attack', только если мы находимся внутри кулдауна анимации выстрела!
    if (nowMs < def.attackLockUntilMs) return 'attack'

    const hpRatio = Math.max(0, def.health) / def.maxHealth
    if (hpRatio <= 0.3) return 'damage30'
    if (hpRatio <= 0.6) return 'damage60'

    const hurtDuration = def.getHurtAnimationDurationMs()
    if (hurtDuration > 0 && nowMs - def.lastHurtAtMs < hurtDuration) return 'hurt'

    return 'idle'
  }

  const getEnemyVisualState = (enemy: Enemy | Boss, nowMs: number): AnimationState => {
    if (enemy.isDying) return 'death'

    if (enemy.isEating || nowMs < enemy.attackLockUntilMs) return 'attack'

    const hpRatio = Math.max(0, enemy.health) / enemy.maxHealth
    if (hpRatio <= 0.3) return 'damage30'
    if (hpRatio <= 0.6) return 'damage60'

    const hurtDuration = enemy.getHurtAnimationDurationMs()
    if (hurtDuration > 0 && nowMs - enemy.lastHurtAtMs < hurtDuration) return 'hurt'

    return 'idle'
  }

  const drawDefenderEntity = (ctx: CanvasRenderingContext2D, def: Defender, nowMs: number) => {
    const targetState = getDefenderVisualState(def, nowMs)
    const previousState = def.animation.currentState

    let forceHurtRestart = false
    if (targetState === 'hurt' && previousState === 'hurt' && def.lastHurtAtMs === nowMs) {
      forceHurtRestart = true
    }

    if (previousState !== targetState || forceHurtRestart) {
      if (forceHurtRestart) {
        def.animation.stateStartedAtMs = nowMs
      } else if (targetState === 'death') {
        setAnimationState(def.animation, targetState, nowMs)
      } else if (targetState === 'hurt') {
        def.resumeState = previousState
        def.resumeTimeElapsed = nowMs - def.animation.stateStartedAtMs
        setAnimationState(def.animation, targetState, nowMs)
      } else if (previousState === 'hurt') {
        setAnimationState(def.animation, targetState, nowMs)
        def.animation.stateStartedAtMs = nowMs - def.resumeTimeElapsed
      } else if (isWalkState(previousState) && isWalkState(targetState)) {
        def.animation.currentState = targetState
      } else {
        setAnimationState(def.animation, targetState, nowMs)
      }
    }

    const drawn = drawAnimatedSprite(
      ctx,
      def.typeKey,
      DEFENDER_VISUALS,
      def.animation,
      def.x,
      def.y,
      def.width,
      def.height,
      nowMs
    )

    if (!drawn) {
      ctx.fillStyle = def.color
      ctx.beginPath()
      ctx.roundRect(def.x, def.y, def.width, def.height, 18)
      ctx.fill()
    }

    const barX = def.x + 6
    const barY = def.y + def.height - 12
    const barFullWidth = def.width - 12
    const barHeight = 6
    const barRadius = barHeight / 2

    ctx.fillStyle = '#244'
    ctx.beginPath()
    ctx.roundRect(barX, barY, barFullWidth, barHeight, barRadius)
    ctx.fill()

    const healthWidth = (barFullWidth * Math.max(0, def.health)) / def.maxHealth
    ctx.fillStyle = '#9cf5ad'
    ctx.beginPath()
    ctx.roundRect(barX, barY, healthWidth, barHeight, barRadius)
    ctx.fill()
  }

  const drawEnemyEntity = (ctx: CanvasRenderingContext2D, enemy: Enemy | Boss, nowMs: number) => {
    const targetState = getEnemyVisualState(enemy, nowMs)
    const previousState = enemy.animation.currentState

    let forceAttackRestart = false
    if (targetState === 'attack' && previousState === 'attack') {
      const visuals = ENEMY_VISUALS[enemy.typeKey]
      if (
        visuals &&
        isAnimationFinished(visuals, 'attack', nowMs, enemy.animation.stateStartedAtMs)
      ) {
        forceAttackRestart = true
      }
    }

    let forceHurtRestart = false
    if (targetState === 'hurt' && previousState === 'hurt' && enemy.lastHurtAtMs === nowMs) {
      forceHurtRestart = true
    }

    if (previousState !== targetState || forceAttackRestart || forceHurtRestart) {
      if (forceAttackRestart) {
        enemy.animation.currentState = targetState
        enemy.animation.stateStartedAtMs = nowMs
        enemy.resumeTimeElapsed = 0
      } else if (forceHurtRestart) {
        enemy.animation.stateStartedAtMs = nowMs
      } else if (targetState === 'death') {
        setAnimationState(enemy.animation, targetState, nowMs)
      } else if (targetState === 'hurt') {
        enemy.resumeState = previousState
        enemy.resumeTimeElapsed = nowMs - enemy.animation.stateStartedAtMs
        setAnimationState(enemy.animation, targetState, nowMs)
      } else if (previousState === 'hurt') {
        setAnimationState(enemy.animation, targetState, nowMs)
        enemy.animation.stateStartedAtMs = nowMs - enemy.resumeTimeElapsed
      } else if (isWalkState(previousState) && isWalkState(targetState)) {
        enemy.animation.currentState = targetState
      } else {
        setAnimationState(enemy.animation, targetState, nowMs)
      }
    }

    const drawn = drawAnimatedSprite(
      ctx,
      enemy.typeKey,
      ENEMY_VISUALS,
      enemy.animation,
      enemy.x,
      enemy.y,
      enemy.width,
      enemy.height,
      nowMs
    )

    if (!drawn) {
      let alpha = 1
      if (enemy.isDying) alpha = Math.max(0, 1 - enemy.deathTimer / 18)
      ctx.save()
      ctx.globalAlpha = alpha
      ctx.fillStyle = enemy.color
      ctx.beginPath()
      ctx.roundRect(enemy.x, enemy.y, enemy.width, enemy.height, enemy.isBoss ? 20 : 14)
      ctx.fill()
      ctx.restore()
    }

    const barX = enemy.x + 6
    const barY = enemy.y + enemy.height - 12
    const barFullWidth = enemy.width - 12
    const barHeight = 6
    const barRadius = barHeight / 2

    ctx.fillStyle = '#263238'
    ctx.beginPath()
    ctx.roundRect(barX, barY, barFullWidth, barHeight, barRadius)
    ctx.fill()

    const healthWidth = (barFullWidth * Math.max(0, enemy.health)) / enemy.maxHealth
    ctx.fillStyle = enemy.isBoss ? '#ffcf88' : '#ff8a80'
    ctx.beginPath()
    ctx.roundRect(barX, barY, healthWidth, barHeight, barRadius)
    ctx.fill()
  }

  const drawAnimatedSprite = (
    ctx: CanvasRenderingContext2D,
    entityKey: string,
    visualsMap: Record<string, VisualAssetConfig>,
    runtimeAnimation: { currentState: AnimationState; stateStartedAtMs: number },
    x: number,
    y: number,
    width: number,
    height: number,
    nowMs: number
  ) => {
    const visuals = visualsMap[entityKey]
    if (!visuals) return false

    const clip = visuals.states[runtimeAnimation.currentState] ?? visuals.states.idle
    if (!clip || clip.frames.length === 0) return false

    const frameIndex = getAnimationFrameIndex(
      visuals,
      runtimeAnimation.currentState,
      nowMs,
      runtimeAnimation.stateStartedAtMs
    )

    const frameSrc = clip.frames[frameIndex]
    const img = gameState.current.images[frameSrc]
    if (!img) return false

    const { drawX, drawY, drawWidth, drawHeight } = getVisualScaleRect(x, y, width, height, visuals)
    ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight)
    return true
  }

  const buildLaneYs = () => {
    const state = gameState.current
    state.laneYs = []
    for (let row = 0; row < state.laneCount; row++) {
      state.laneYs.push(state.topBarHeight + row * state.cellSize + state.cellGap)
    }
  }

  const createGrid = () => {
    const state = gameState.current
    state.gameGrid = []
    for (let y = state.topBarHeight; y < state.canvasHeight; y += state.cellSize) {
      for (let x = state.lawnStripWidth; x < state.canvasWidth; x += state.cellSize) {
        state.gameGrid.push(new Cell(x, y, state.cellSize))
      }
    }
  }

  const buildLawnMowers = () => {
    const state = gameState.current
    state.lawnMowers = state.laneYs.map(
      laneY => new LawnMower(laneY, state.cellSize, state.lawnStripWidth)
    )
  }

  const spawnFallingSun = () => {
    const state = gameState.current
    const x =
      state.lawnStripWidth + 40 + Math.random() * (state.canvasWidth - state.lawnStripWidth - 120)
    const targetLane = state.laneYs[Math.floor(Math.random() * state.laneYs.length)]
    const targetY = targetLane + state.cellSize * 0.35

    state.suns.push(new Sun(x, state.topBarHeight - 25, targetY, 25, false, state.gameTimeMs))
  }

  const updateThreatPreview = () => {
    const state = gameState.current
    state.threatPreview = state.pendingSpawns
      .filter(spawn => spawn.frame >= state.frame && spawn.frame - state.frame <= 180)
      .slice(0, 10)
      .map(spawn => ({
        lane: spawn.lane,
        enemyType: spawn.enemyType,
        framesLeft: spawn.frame - state.frame
      }))
  }

  const createWaveBossRules = (_waveNumber: number, cycleNumber: number) => {
    const state = gameState.current
    if (!state.modeConfig.endless) return state.bossWaveOverrides

    const base = 4 + ((cycleNumber - 1) % 2)
    const result = [base, base + 1].filter(v => v <= state.wavesPerCycle)

    if (cycleNumber >= 2) {
      const randomChance = Math.min(0.12 + cycleNumber * 0.04, 0.45)
      if (Math.random() < randomChance) {
        const randomWave = 2 + Math.floor(Math.random() * Math.max(1, state.wavesPerCycle - 1))
        if (!result.includes(randomWave)) result.push(randomWave)
      }
    }

    result.sort((a, b) => a - b)
    return result
  }

  const buildDynamicWaveQueue = (waveNumber: number, cycleNumber: number) => {
    const state = gameState.current
    const queue: PendingSpawn[] = []

    let frameCursor = 70
    const weakCount = 3 + Math.floor(waveNumber * 0.8) + Math.max(0, cycleNumber - 1)
    const midCount = Math.max(1, waveNumber - 1)
    const strongCount =
      Math.max(0, Math.floor((waveNumber - 2) / 2)) + Math.floor((cycleNumber - 1) / 2)

    for (let i = 0; i < weakCount; i++) {
      queue.push({
        frame: frameCursor,
        enemyType: Math.random() < 0.28 ? 'runner' : 'walker',
        lane: Math.floor(Math.random() * state.laneCount) + 1
      })
      frameCursor += 55
    }

    frameCursor += 65
    for (let i = 0; i < midCount; i++) {
      const roll = Math.random()
      const enemyType: EnemyTypeKey = roll < 0.45 ? 'ghoul' : roll < 0.7 ? 'arsonist' : 'ranged'
      queue.push({
        frame: frameCursor,
        enemyType,
        lane: Math.floor(Math.random() * state.laneCount) + 1
      })
      frameCursor += 42
    }

    frameCursor += 70
    for (let i = 0; i < strongCount; i++) {
      let enemyType: EnemyTypeKey = 'brute'
      if (Math.random() < state.modeConfig.eliteChance + cycleNumber * 0.03) enemyType = 'elite'
      queue.push({
        frame: frameCursor,
        enemyType,
        lane: Math.floor(Math.random() * state.laneCount) + 1
      })
      frameCursor += 58
    }

    const bossWaves = createWaveBossRules(waveNumber, cycleNumber)
    if (bossWaves.includes(waveNumber)) {
      queue.push({
        frame: frameCursor + 90,
        enemyType: 'boss',
        lane: Math.floor(Math.random() * state.laneCount) + 1
      })
    }

    queue.sort((a, b) => a.frame - b.frame)

    const hasBoss = queue.some(item => item.enemyType === 'boss')
    if (hasBoss && !state.bossWaves.includes(waveNumber)) {
      state.bossWaves.push(waveNumber)
      state.bossWaves.sort((a, b) => a - b)
    }

    state.waveMeta = {
      totalSpawns: queue.length,
      durationFrames: (queue[queue.length - 1]?.frame ?? 0) + 320
    }

    return queue
  }

  const startWave = (waveNumber: number, cycleNumber: number) => {
    const state = gameState.current
    state.waveNumber = waveNumber
    state.cycleNumber = cycleNumber
    state.currentWaveLabel = `Cycle ${cycleNumber} · Wave ${waveNumber}`
    state.frame = 0
    state.pendingSpawns = buildDynamicWaveQueue(waveNumber, cycleNumber)
    state.bossActive = false
    updateThreatPreview()
  }

  const startNextWave = () => {
    const state = gameState.current
    if (state.paused) return

    if (state.modeConfig.endless) {
      if (state.waveNumber >= state.wavesPerCycle) {
        const nextCycle = state.cycleNumber + 1
        state.endlessDifficultyScale *= 1.1
        state.flagsEarned = 0
        state.wavesPerCycle = [4, 5, 6, 7][(nextCycle - 1) % 4]
        state.bossWaves = []
        startWave(1, nextCycle)
      } else {
        state.flagsEarned++
        startWave(state.waveNumber + 1, state.cycleNumber)
      }
      return
    }

    if (state.waveNumber < state.wavesPerCycle) {
      state.flagsEarned++
      startWave(state.waveNumber + 1, state.cycleNumber)
    } else {
      state.victory = true
    }
  }

  const drawBoard = (ctx: CanvasRenderingContext2D) => {
    const state = gameState.current

    const boardBg = THEME_ASSETS.boardBackground
      ? state.images[THEME_ASSETS.boardBackground]
      : undefined

    if (boardBg) {
      ctx.drawImage(boardBg, 0, 0, state.canvasWidth, state.canvasHeight)
    } else {
      ctx.clearRect(0, 0, state.canvasWidth, state.canvasHeight)
    }

    const topBar = THEME_ASSETS.topBarBackground
      ? state.images[THEME_ASSETS.topBarBackground]
      : undefined

    if (topBar) {
      ctx.drawImage(topBar, 0, 0, state.canvasWidth, state.topBarHeight)
    } else {
      const topGradient = ctx.createLinearGradient(0, 0, 0, state.topBarHeight)
      topGradient.addColorStop(0, '#8d5a2b')
      topGradient.addColorStop(1, '#5b3717')
      ctx.fillStyle = topGradient
      ctx.fillRect(0, 0, state.canvasWidth, state.topBarHeight)
    }

    const leftStrip = THEME_ASSETS.leftLaneStrip
      ? state.images[THEME_ASSETS.leftLaneStrip]
      : undefined

    if (leftStrip) {
      ctx.drawImage(
        leftStrip,
        0,
        state.topBarHeight,
        state.lawnStripWidth,
        state.canvasHeight - state.topBarHeight
      )
    } else {
      ctx.fillStyle = '#d7ccc8'
      ctx.fillRect(
        0,
        state.topBarHeight,
        state.lawnStripWidth,
        state.canvasHeight - state.topBarHeight
      )
    }

    for (let row = 0; row < state.laneCount; row++) {
      for (let x = state.lawnStripWidth; x < state.canvasWidth; x += state.cellSize) {
        const col = Math.floor((x - state.lawnStripWidth) / state.cellSize)
        const y = state.topBarHeight + row * state.cellSize

        const grassSrc = THEME_ASSETS.grassTiles[(row + col) % THEME_ASSETS.grassTiles.length]
        const grassImg = state.images[grassSrc]

        if (grassImg) {
          ctx.drawImage(grassImg, x, y, state.cellSize, state.cellSize)
        } else {
          ctx.fillStyle = (row + col) % 2 === 0 ? '#4caf50' : '#43a047'
          ctx.fillRect(x, y, state.cellSize, state.cellSize)
        }
      }
    }

    const rightStrip = THEME_ASSETS.rightLaneStrip
      ? state.images[THEME_ASSETS.rightLaneStrip]
      : undefined

    if (rightStrip) {
      ctx.drawImage(
        rightStrip,
        state.canvasWidth - 34,
        state.topBarHeight,
        34,
        state.canvasHeight - state.topBarHeight
      )
    } else {
      ctx.fillStyle = '#c8b8a6'
      ctx.fillRect(
        state.canvasWidth - 34,
        state.topBarHeight,
        34,
        state.canvasHeight - state.topBarHeight
      )
    }
  }

  const drawThreatPreview = (ctx: CanvasRenderingContext2D) => {
    const state = gameState.current
    const laneMap = new Map<number, EnemyTypeKey[]>()

    state.threatPreview.forEach(item => {
      if (!laneMap.has(item.lane)) laneMap.set(item.lane, [])
      laneMap.get(item.lane)!.push(item.enemyType)
    })

    laneMap.forEach((types, lane) => {
      const laneY = state.laneYs[lane - 1]
      const hasBoss = types.includes('boss')

      ctx.fillStyle = hasBoss ? 'rgba(255, 82, 82, 0.16)' : 'rgba(255,255,255,0.08)'
      ctx.fillRect(
        state.lawnStripWidth,
        laneY,
        state.canvasWidth - state.lawnStripWidth,
        state.cellSize
      )

      ctx.fillStyle = hasBoss ? '#ff5252' : '#fff'
      ctx.font = 'bold 14px Orbitron, sans-serif'
      ctx.fillText(hasBoss ? 'BOSS INCOMING' : 'THREAT', state.canvasWidth - 220, laneY + 24)
    })
  }

  const drawHoverCell = () => {
    const state = gameState.current
    if (!state.ctx || !state.hoverCell.valid) return

    state.ctx.strokeStyle = 'rgba(255,255,255,0.95)'
    state.ctx.lineWidth = 3
    state.ctx.strokeRect(
      state.hoverCell.x,
      state.hoverCell.y,
      state.hoverCell.width,
      state.hoverCell.height
    )
  }

  const handleProjectiles = (nowMs: number) => {
    const state = gameState.current
    if (!state.ctx) return

    for (let i = 0; i < state.projectiles.length; i++) {
      const projectile = state.projectiles[i]
      projectile.update()
      projectile.draw(state.ctx)

      for (let j = 0; j < state.enemies.length; j++) {
        const enemy = state.enemies[j]
        if (!enemy.isDying && collision(projectile, enemy)) {
          enemy.health -= projectile.power

          const hurtDuration = enemy.getHurtAnimationDurationMs()
          if (nowMs - enemy.lastHurtAtMs >= hurtDuration) {
            enemy.lastHurtAtMs = nowMs
          }

          if (projectile.slowPower) enemy.applySlow(projectile.slowPower)

          if (enemy.health <= 0 && !enemy.isDying) {
            enemy.startDeath(nowMs)
          }

          state.projectiles.splice(i, 1)
          i--
          break
        }
      }

      if (state.projectiles[i] && state.projectiles[i].x > state.canvasWidth) {
        state.projectiles.splice(i, 1)
        i--
      }
    }
  }

  const handleDefenders = (nowMs: number) => {
    const state = gameState.current
    if (!state.ctx) return

    if (state.paused) {
      for (const defender of state.defenders) {
        drawDefenderEntity(state.ctx, defender, nowMs)
      }
      return
    }

    for (let i = 0; i < state.enemies.length; i++) {
      if (!state.enemies[i].isDying) {
        state.enemies[i].movement = state.enemies[i].speed
        state.enemies[i].isEating = false
      }
    }

    for (let i = 0; i < state.defenders.length; i++) {
      const defender = state.defenders[i]

      if (defender.isDying) {
        defender.update(state, nowMs)
        drawDefenderEntity(state.ctx, defender, nowMs)

        const visuals = DEFENDER_VISUALS[defender.typeKey]
        let shouldRemove = false

        if (visuals?.states?.['death']) {
          shouldRemove = isAnimationFinished(
            visuals,
            'death',
            nowMs,
            defender.animation.stateStartedAtMs
          )
        } else {
          shouldRemove = defender.deathTimer > 18
        }

        if (shouldRemove) {
          state.defenders.splice(i, 1)
          i--
        }
        continue
      }

      defender.shooting =
        !defender.isWall &&
        defender.typeKey !== 'sunflower' &&
        state.enemies.some(
          enemy => !enemy.isDying && Math.abs(enemy.y - defender.y) < 18 && enemy.x > defender.x
        )

      defender.update(state, nowMs)
      drawDefenderEntity(state.ctx, defender, nowMs)

      if (state.waitingForFirstPlant) continue

      for (let j = 0; j < state.enemies.length; j++) {
        const enemy = state.enemies[j]
        if (enemy.isDying) continue

        if (enemy.isEating) continue

        if (collision(defender, enemy)) {
          enemy.movement = 0
          enemy.isEating = true
          enemy.attackTimer++

          if (enemy.attackTimer >= enemy.attackRate) {
            defender.health -= enemy.damage

            const defHurtDur = defender.getHurtAnimationDurationMs()
            if (nowMs - defender.lastHurtAtMs >= defHurtDur) {
              defender.lastHurtAtMs = nowMs
            }

            enemy.attackTimer = 0

            if (defender.health <= 0 && !defender.isDying) {
              defender.startDeath(nowMs)
            }
          }
        } else if (
          enemy.isRanged &&
          Math.abs(enemy.y - defender.y) < 18 &&
          enemy.x > defender.x &&
          enemy.x - defender.x < 260
        ) {
          enemy.movement = 0
          enemy.isEating = true
          enemy.attackTimer++

          if (enemy.attackTimer >= enemy.attackRate) {
            defender.health -= enemy.rangedDamage

            const defHurtDur = defender.getHurtAnimationDurationMs()
            if (nowMs - defender.lastHurtAtMs >= defHurtDur) {
              defender.lastHurtAtMs = nowMs
            }

            enemy.attackTimer = 0

            if (defender.health <= 0 && !defender.isDying) {
              defender.startDeath(nowMs)
            }
          }
        }
      }
    }
  }

  const handleSpawnSystem = () => {
    const state = gameState.current

    while (state.pendingSpawns.length > 0 && state.pendingSpawns[0].frame <= state.frame) {
      const spawn = state.pendingSpawns.shift()
      if (!spawn) break

      const baseConfig = ENEMY_TYPES[spawn.enemyType]
      const healthMultiplier = state.modeConfig.enemyHealthMultiplier * state.endlessDifficultyScale
      const damageMultiplier =
        state.modeConfig.enemyDamageMultiplier * Math.sqrt(state.endlessDifficultyScale)

      const laneIndex = Math.min(state.laneCount - 1, Math.max(0, spawn.lane - 1))
      const laneY = state.laneYs[laneIndex]

      if (baseConfig.isBoss) {
        state.enemies.push(
          new Boss(
            laneY,
            state.cellSize,
            state.cellGap,
            state.canvasWidth,
            baseConfig,
            healthMultiplier,
            damageMultiplier
          )
        )
        state.bossActive = true
      } else {
        state.enemies.push(
          new Enemy(
            laneY,
            state.cellSize,
            state.cellGap,
            state.canvasWidth,
            baseConfig,
            healthMultiplier,
            damageMultiplier
          )
        )
      }
    }

    updateThreatPreview()
  }

  const handleEnemies = (nowMs: number) => {
    const state = gameState.current
    if (!state.ctx) return

    for (let i = 0; i < state.enemies.length; i++) {
      const enemy = state.enemies[i]

      if (enemy instanceof Boss) enemy.decideLane(state)

      if (!enemy.isDying && enemy.movement > 0) {
        enemy.attackTimer = 0
      }

      if (!enemy.isDying && enemy.canJump) {
        const blockingDefender = state.defenders.find(
          d => !d.isDying && Math.abs(d.y - enemy.y) < 18 && d.x < enemy.x && enemy.x - d.x < 30
        )

        if (blockingDefender) {
          enemy.x -= state.cellSize * 0.6
          enemy.canJump = false
        }
      }

      enemy.update()
      drawEnemyEntity(state.ctx, enemy, nowMs)

      if (!enemy.isDying && enemy.x <= state.lawnStripWidth) {
        const mower = state.lawnMowers.find(m => Math.abs(m.laneY - enemy.y) < 18)

        if (mower && mower.active && !mower.triggered) {
          mower.triggered = true
          enemy.startDeath(nowMs)
        } else if (!(mower && mower.active && mower.triggered)) {
          state.gameOver = true
        }
      }

      if (!enemy.isDying && enemy.health <= 0) {
        enemy.startDeath(nowMs)
      }

      if (enemy.isDying) {
        const visuals = ENEMY_VISUALS[enemy.typeKey]
        let shouldRemove = false

        if (visuals?.states?.['death']) {
          shouldRemove = isAnimationFinished(
            visuals,
            'death',
            nowMs,
            enemy.animation.stateStartedAtMs
          )
        } else {
          shouldRemove = enemy.deathTimer > 18
        }

        if (shouldRemove) {
          state.numberOfResources += enemy.reward
          state.score += enemy.reward

          if (enemy.isBoss) {
            state.bossActive = false
          }

          state.enemies.splice(i, 1)
          i--
          continue
        }
      }
    }
  }

  const handleSuns = (nowMs: number) => {
    const state = gameState.current
    if (!state.ctx) return

    if (
      !state.paused &&
      !state.waitingForFirstPlant &&
      state.frame > 0 &&
      state.frame % 360 === 0 &&
      !state.gameOver &&
      !state.victory
    ) {
      spawnFallingSun()
    }

    for (let i = 0; i < state.suns.length; i++) {
      const sun = state.suns[i]

      if (!state.paused) {
        sun.update()
      }

      if (sun.isExpired(nowMs)) {
        state.suns.splice(i, 1)
        i--
        continue
      }

      sun.draw(state.ctx)

      const sunBox = {
        x: sun.x - sun.radius,
        y: sun.y - sun.radius,
        width: sun.width,
        height: sun.height
      }

      if (state.mouse.active && collision(sunBox, state.mouse)) {
        state.numberOfResources += sun.amount
        state.suns.splice(i, 1)
        i--
        continue
      }
    }
  }

  const handleLawnMowers = () => {
    const state = gameState.current
    if (!state.ctx) return

    if (state.paused) {
      for (const mower of state.lawnMowers) {
        if (mower.active) mower.draw(state.ctx)
      }
      return
    }

    for (let i = 0; i < state.lawnMowers.length; i++) {
      const mower = state.lawnMowers[i]
      if (!mower.active) continue

      mower.update()
      mower.draw(state.ctx)

      if (mower.triggered) {
        for (let j = state.enemies.length - 1; j >= 0; j--) {
          const enemy = state.enemies[j]
          if (enemy.isDying) continue

          if (Math.abs(enemy.y - mower.laneY) < 18) {
            const mowerHitBox = {
              x: mower.x,
              y: mower.y,
              width: mower.width,
              height: mower.height
            }

            if (collision(mowerHitBox, enemy) || enemy.x < mower.x + mower.width + 12) {
              enemy.startDeath(state.gameTimeMs)
            }
          }
        }

        if (mower.x > state.canvasWidth) {
          mower.active = false
        }
      }
    }
  }

  const formatTime = (frames: number) => {
    const totalSeconds = Math.floor(frames / 90)
    const minutes = Math.floor(totalSeconds / 60)
    const seconds = totalSeconds % 60
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
  }

  const drawFlagProgress = (ctx: CanvasRenderingContext2D, nowMs: number) => {
    const state = gameState.current
    const meterX = 950
    const meterY = 66
    const meterWidth = 260
    const meterHeight = 18

    ctx.fillStyle = 'rgba(0,0,0,0.35)'
    ctx.fillRect(meterX, meterY, meterWidth, meterHeight)

    const completedBeforeCurrent = state.waitingForFirstPlant ? 0 : state.waveNumber - 1
    const currentWaveProgress = state.waitingForFirstPlant
      ? 0
      : Math.min(1, state.frame / Math.max(1, state.waveMeta.durationFrames))
    const totalProgress =
      (completedBeforeCurrent + currentWaveProgress) / Math.max(1, state.wavesPerCycle)

    ctx.fillStyle = '#7cb342'
    ctx.fillRect(meterX, meterY, meterWidth * totalProgress, meterHeight)

    const blinkOn = Math.floor(nowMs / 250) % 2 === 0

    for (let i = 1; i <= state.wavesPerCycle; i++) {
      const fx = meterX + (meterWidth / state.wavesPerCycle) * i

      ctx.strokeStyle = '#fff'
      ctx.beginPath()
      ctx.moveTo(fx, meterY - 6)
      ctx.lineTo(fx, meterY + meterHeight + 6)
      ctx.stroke()

      const isPastOrCurrentWave = i <= state.waveNumber
      const isBossWave = state.bossWaves.includes(i)
      const isFutureBossWave = isBossWave && i > state.waveNumber

      let flagColor = '#fff176'
      if (isBossWave && isPastOrCurrentWave) flagColor = '#e53935'
      else if (isFutureBossWave) flagColor = blinkOn ? '#ff5252' : '#fff176'

      ctx.fillStyle = flagColor
      ctx.beginPath()
      ctx.moveTo(fx, meterY - 6)
      ctx.lineTo(fx + 10, meterY - 2)
      ctx.lineTo(fx, meterY + 2)
      ctx.closePath()
      ctx.fill()
    }
  }

  const handleGameStatus = (nowMs: number) => {
    const state = gameState.current
    if (!state.ctx) return

    state.ctx.fillStyle = '#ffe082'
    state.ctx.font = 'bold 26px Orbitron, sans-serif'
    state.ctx.fillText(`Score: ${state.score}`, 18, 36)
    state.ctx.fillText(`Sun: ${state.numberOfResources}`, 18, 72)

    state.ctx.fillStyle = '#f5f5f5'
    state.ctx.font = 'bold 22px Orbitron, sans-serif'
    state.ctx.fillText(`Mode: ${state.modeConfig.label}`, 320, 36)
    state.ctx.fillText(`${state.currentWaveLabel}`, 320, 72)

    state.ctx.fillStyle = state.bossActive ? '#ff8a65' : '#e8f5e9'
    state.ctx.font = 'bold 20px Orbitron, sans-serif'
    state.ctx.fillText(`Boss: ${state.bossActive ? 'ACTIVE' : 'none'}`, 650, 36)
    state.ctx.fillText(`Incoming: ${state.pendingSpawns.length + state.enemies.length}`, 650, 72)

    state.ctx.fillStyle = '#fff'
    state.ctx.font = 'bold 18px Orbitron, sans-serif'
    state.ctx.fillText(`Time: ${formatTime(state.endlessTimerFrames)}`, 950, 36)

    drawFlagProgress(state.ctx, nowMs)

    if (state.waitingForFirstPlant) {
      state.ctx.fillStyle = 'rgba(0,0,0,0.35)'
      state.ctx.fillRect(0, 0, state.canvasWidth, state.canvasHeight)
      state.ctx.fillStyle = '#fff'
      state.ctx.font = 'bold 40px Orbitron, sans-serif'
      state.ctx.fillText('Click on the field to start', 340, 360)
      return
    }

    if (
      !state.paused &&
      !state.gameOver &&
      !state.victory &&
      state.pendingSpawns.length === 0 &&
      state.enemies.length === 0
    ) {
      if (state.modeConfig.endless) {
        startNextWave()
      } else if (state.waveNumber >= state.wavesPerCycle) {
        state.victory = true
      } else {
        startNextWave()
      }
    }

    if (state.modeConfig.endless && state.score > state.bestScore) {
      state.bestScore = state.score
    }

    if (state.gameOver) {
      state.ctx.fillStyle = 'rgba(0,0,0,0.72)'
      state.ctx.fillRect(0, 0, state.canvasWidth, state.canvasHeight)
      state.ctx.fillStyle = '#fff'
      state.ctx.font = 'bold 78px Orbitron, sans-serif'
      state.ctx.fillText('GAME OVER', 370, 360)
      state.ctx.font = '28px Orbitron, sans-serif'
      state.ctx.fillText('Restart and try another strategy.', 400, 410)
    }

    if (state.victory) {
      state.ctx.fillStyle = 'rgba(255,255,255,0.18)'
      state.ctx.fillRect(0, 0, state.canvasWidth, state.canvasHeight)
      state.ctx.fillStyle = '#111'
      state.ctx.font = 'bold 64px Orbitron, sans-serif'
      state.ctx.fillText('LEVEL COMPLETE', 315, 340)
      state.ctx.font = '28px Orbitron, sans-serif'
      state.ctx.fillText(`You win with ${state.score} points!`, 405, 388)
    }
  }

  const animate = (timestamp: number) => {
    const state = gameState.current
    if (!state.ctx) return

    const prev = previousTimestampRef.current ?? timestamp
    const deltaMs = Math.min(64, timestamp - prev)
    previousTimestampRef.current = timestamp

    const fixedStepMs = 1000 / 90

    if (!state.paused) {
      state.logicAccumulatorMs += deltaMs
    }

    while (state.logicAccumulatorMs >= fixedStepMs) {
      if (!state.waitingForFirstPlant && !state.paused && !state.gameOver && !state.victory) {
        state.frame++
        state.endlessTimerFrames++
        state.gameTimeMs += fixedStepMs
      }
      state.logicAccumulatorMs -= fixedStepMs
    }

    const renderNowMs = state.gameTimeMs

    state.ctx.clearRect(0, 0, state.canvasWidth, state.canvasHeight)
    drawBoard(state.ctx)
    drawThreatPreview(state.ctx)
    drawHoverCell()

    handleLawnMowers()
    handleDefenders(renderNowMs)
    handleSuns(renderNowMs)

    if (!state.paused && !state.waitingForFirstPlant) {
      handleSpawnSystem()
      handleProjectiles(renderNowMs)
      handleEnemies(renderNowMs)

      if (state.frame % 20 === 0) {
        setUiTick(v => v + 1)
      }
    } else if (state.paused) {
      state.projectiles.forEach(projectile => projectile.draw(state.ctx!))
      state.enemies.forEach(enemy => drawEnemyEntity(state.ctx!, enemy, renderNowMs))
    }

    handleGameStatus(renderNowMs)

    if (state.paused) {
      state.ctx.fillStyle = 'rgba(0,0,0,0.35)'
      state.ctx.fillRect(0, 0, state.canvasWidth, state.canvasHeight)
      state.ctx.fillStyle = '#fff'
      state.ctx.font = 'bold 64px Orbitron, sans-serif'
      state.ctx.fillText('PAUSED', 450, 360)
    }

    if (!state.gameOver && !state.victory) {
      animationFrameRef.current = requestAnimationFrame(animate)
    }
  }

  const resetGame = () => {
    const state = gameState.current
    if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current)

    previousTimestampRef.current = null

    state.modeKey = selectedMode
    state.modeConfig = GAME_MODES[selectedMode]
    state.numberOfResources = state.modeConfig.startResources
    state.frame = 0
    state.gameOver = false
    state.victory = false
    state.paused = false
    state.score = 0
    state.waveNumber = 1
    state.cycleNumber = 1
    state.wavesPerCycle = state.modeConfig.wavesPerCycle
    state.currentWaveLabel = 'Click on the field to start'
    state.pendingSpawns = []
    state.endlessDifficultyScale = 1
    state.bossActive = false
    state.defenders = []
    state.enemies = []
    state.projectiles = []
    state.suns = []
    state.flagsEarned = 0
    state.endlessTimerFrames = 0
    state.hoverCell = { x: 0, y: 0, width: 0, height: 0, valid: false }
    state.removalsLeft = 3
    state.selectedTool = 'plant'
    state.threatPreview = []
    state.bossWaveOverrides = [...state.modeConfig.bossDefaultWaves]
    state.bossWaves = []
    state.waitingForFirstPlant = true
    state.waveMeta = { totalSpawns: 0, durationFrames: 1 }
    state.logicAccumulatorMs = 0
    state.gameTimeMs = 0

    buildLaneYs()
    createGrid()
    buildLawnMowers()

    animationFrameRef.current = requestAnimationFrame(animate)
    setUiTick(v => v + 1)
  }

  const togglePause = () => {
    const state = gameState.current
    if (state.gameOver || state.victory || state.waitingForFirstPlant) return

    state.paused = !state.paused
    if (!state.paused) {
      previousTimestampRef.current = null
    }
    setUiTick(v => v + 1)
  }

  useEffect(() => {
    let isMounted = true

    const boot = async () => {
      const canvas = canvasRef.current
      if (!canvas) return

      const ctx = canvas.getContext('2d')
      if (!ctx) return

      canvas.width = gameState.current.canvasWidth
      canvas.height = gameState.current.canvasHeight
      gameState.current.ctx = ctx

      const allAssets = collectAllAssetPaths(THEME_ASSETS, DEFENDER_VISUALS, ENEMY_VISUALS)
      const images = await loadImagesMap(allAssets)
      if (!isMounted) return

      gameState.current.images = images

      buildLaneYs()
      createGrid()
      buildLawnMowers()
      resetGame()
    }

    boot()

    return () => {
      isMounted = false
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current)
    }
  }, [])

  useEffect(() => {
    if (!gameState.current.ctx) return
    resetGame()
  }, [selectedMode])

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const state = gameState.current

    const scaleX = state.canvasWidth / rect.width
    const scaleY = state.canvasHeight / rect.height

    const x = (e.clientX - rect.left) * scaleX
    const y = (e.clientY - rect.top) * scaleY

    state.mouse.x = x - 1
    state.mouse.y = y - 1
    state.mouse.width = 2
    state.mouse.height = 2
    state.mouse.active = true

    if (y < state.topBarHeight || x < state.lawnStripWidth) {
      state.hoverCell.valid = false
      return
    }

    const cellX = Math.floor((x - state.lawnStripWidth) / state.cellSize)
    const cellY = Math.floor((y - state.topBarHeight) / state.cellSize)

    if (cellY < 0 || cellY >= state.laneCount) {
      state.hoverCell.valid = false
      return
    }

    state.hoverCell = {
      x: state.lawnStripWidth + cellX * state.cellSize,
      y: state.topBarHeight + cellY * state.cellSize,
      width: state.cellSize,
      height: state.cellSize,
      valid: true
    }
  }

  const handleMouseLeave = () => {
    const state = gameState.current
    state.mouse.x = -9999
    state.mouse.y = -9999
    state.mouse.active = false
    state.hoverCell.valid = false
  }

  const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const state = gameState.current

    if (state.paused || state.gameOver || state.victory) return

    const scaleX = state.canvasWidth / rect.width
    const scaleY = state.canvasHeight / rect.height

    const mouseX = (e.clientX - rect.left) * scaleX
    const mouseY = (e.clientY - rect.top) * scaleY

    if (state.waitingForFirstPlant) {
      if (mouseY >= state.topBarHeight && mouseX >= state.lawnStripWidth) {
        state.waitingForFirstPlant = false
        state.waveNumber = 1
        state.cycleNumber = 1
        state.currentWaveLabel = 'Cycle 1 · Wave 1'
        state.frame = 0
        state.pendingSpawns = buildDynamicWaveQueue(1, 1)
        previousTimestampRef.current = null
        setUiTick(v => v + 1)
      }
      return
    }

    for (let i = 0; i < state.suns.length; i++) {
      const sun = state.suns[i]
      const sunBox = {
        x: sun.x - sun.radius,
        y: sun.y - sun.radius,
        width: sun.width,
        height: sun.height
      }
      const clickPoint = { x: mouseX, y: mouseY, width: 1, height: 1 }
      if (collision(sunBox, clickPoint)) {
        state.numberOfResources += sun.amount
        state.suns.splice(i, 1)
        setUiTick(v => v + 1)
        return
      }
    }

    if (mouseY < state.topBarHeight) return
    if (mouseX < state.lawnStripWidth) return

    const gridPositionX =
      state.lawnStripWidth +
      Math.floor((mouseX - state.lawnStripWidth) / state.cellSize) * state.cellSize +
      state.cellGap

    const gridPositionY =
      state.topBarHeight +
      Math.floor((mouseY - state.topBarHeight) / state.cellSize) * state.cellSize +
      state.cellGap

    if (state.selectedTool === 'shovel') {
      if (state.removalsLeft <= 0) return
      const defenderIndex = state.defenders.findIndex(
        d => d.x === gridPositionX && d.y === gridPositionY && !d.isDying
      )
      if (defenderIndex !== -1) {
        state.defenders[defenderIndex].startDeath(state.gameTimeMs)
        state.removalsLeft -= 1
        state.selectedTool = 'plant'
        setUiTick(v => v + 1)
      }
      return
    }

    const targetCellBox = {
      x: gridPositionX,
      y: gridPositionY,
      width: state.cellSize - state.cellGap * 2,
      height: state.cellSize - state.cellGap * 2
    }

    for (let i = 0; i < state.suns.length; i++) {
      const sun = state.suns[i]
      const sunBox = {
        x: sun.x - sun.radius,
        y: sun.y - sun.radius,
        width: sun.width,
        height: sun.height
      }
      if (collision(targetCellBox, sunBox)) return
    }

    for (let i = 0; i < state.defenders.length; i++) {
      const d = state.defenders[i]
      if (!d.isDying && d.x === gridPositionX && d.y === gridPositionY) return
    }

    const defenderConfig = DEFENDER_TYPES[selectedDefender]
    if (state.numberOfResources >= defenderConfig.cost) {
      state.defenders.push(
        new Defender(gridPositionX, gridPositionY, state.cellSize, state.cellGap, defenderConfig)
      )
      state.numberOfResources -= defenderConfig.cost
      setUiTick(v => v + 1)
    }
  }

  const currentState = gameState.current
  const cards = useMemo(() => Object.values(DEFENDER_TYPES), [])

  return (
    <div className={styles.main}>
      <div
        style={{
          width: `${gameState.current.canvasWidth}px`
        }}
        className={styles.header}
      >
        <div className={styles.informations}>
          <div className={styles.suns}>
            <h1>☀️</h1>
            <h2>{currentState.numberOfResources}</h2>
          </div>

          <div className={styles.cards}>
            {cards.map(defender => (
              <button
                key={defender.key}
                onClick={() => setSelectedDefender(defender.key)}
                className={styles.card}
                style={{
                  border:
                    selectedDefender === defender.key
                      ? '2px solid #fff59d'
                      : '2px solid rgba(255,255,255,0.2)'
                  // background: defender.color
                }}
              >
                <h3>{defender.name}</h3>
                <img
                  className={styles.poster}
                  src={`/assets/plants/${defender.key}/poster/poster.png`}
                  alt=""
                />
                {/* <p>{defender.description}</p> */}
                {/* <p>HP {defender.maxHealth}</p> */}
                {/* <p>DMG {defender.damage}</p> */}
                <div className={styles.price}>
                  <p>Cost {defender.cost}</p>
                  <h2>☀️</h2>
                </div>
              </button>
            ))}
          </div>
        </div>
        <div className={styles.settings}>
          <div className={styles.btns}>
            <div className={styles.modes}>
              {Object.values(GAME_MODES).map(mode => (
                <button
                  key={mode.key}
                  onClick={() => setSelectedMode(mode.key)}
                  className={styles.mode}
                  style={{
                    border:
                      selectedMode === mode.key
                        ? '2px solid #fff17670'
                        : '2px solid rgba(255,255,255,0.3)',
                    background: selectedMode === mode.key ? '#2e7d32' : '#ffffff30'
                  }}
                >
                  {mode.label}
                </button>
              ))}
            </div>

            <button
              onClick={() => {
                const state = gameState.current
                state.selectedTool = state.selectedTool === 'plant' ? 'shovel' : 'plant'
                setUiTick(v => v + 1)
              }}
              style={{
                background: currentState.selectedTool === 'shovel' ? '#8d6e63' : '#455a64'
              }}
              className={styles.btn}
            >
              {currentState.selectedTool === 'shovel'
                ? 'Shovel ON'
                : `Shovel (${currentState.removalsLeft})`}
            </button>

            <button
              onClick={togglePause}
              style={{
                background: currentState.paused ? '#2e7d32' : '#6d4c41'
              }}
              className={styles.btn}
            >
              {currentState.paused ? 'Resume' : 'Pause'}
            </button>

            <button
              onClick={resetGame}
              style={{
                background: '#2f3e46'
              }}
              className={styles.btn}
            >
              Restart
            </button>
          </div>

          <div className={styles.statistics}>
            <div>
              <strong>Cycle:</strong> {currentState.cycleNumber}
            </div>
            <div>
              <strong>Wave:</strong> {currentState.waveNumber}/{currentState.wavesPerCycle}
            </div>
            <div>
              <strong>Score:</strong> {currentState.score}
            </div>
            <div>
              <strong>Best:</strong> {currentState.bestScore}
            </div>
            <div>
              <strong>Time:</strong> {formatTime(currentState.endlessTimerFrames)}
            </div>
            <div>
              <strong>Boss:</strong> {currentState.bossActive ? 'Active' : 'None'}
            </div>
            <div>
              <strong>Removals:</strong> {currentState.removalsLeft}
            </div>
            <div>
              <strong>Tool:</strong> {currentState.selectedTool}
            </div>
            <div>
              <strong>Paused:</strong> {currentState.paused ? 'Yes' : 'No'}
            </div>
            <div>
              <strong>Threats:</strong> {currentState.threatPreview.length}
            </div>
          </div>
        </div>
      </div>

      <canvas
        ref={canvasRef}
        id={styles.canvas1}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
      />
    </div>
  )
}

export default TowerDefense
