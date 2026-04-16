import React, { useRef, useEffect, useState } from 'react'
// import { useGameLoop } from '@hooks/useGameLoop'
import { useSounds } from '@hooks/useSounds'
import { GameState, Player, Obstacle, Portal } from '@/types/game'
import { HighScores } from '@components/layout/high-scores/HighScores'
import styles from './GeometryDash.module.css'

const CANVAS_WIDTH = 800
const CANVAS_HEIGHT = 400
const GROUND_Y = 350
const PLAYER_SIZE = 30
const PLAYER_START_X = 100
const PLAYER_START_Y = GROUND_Y - PLAYER_SIZE
const BASE_SPEED = 5

const createInitialPlayer = (): Player => ({
  pos: { x: PLAYER_START_X, y: PLAYER_START_Y },
  vel: { x: 0, y: 0 },
  size: PLAYER_SIZE,
  isGrounded: true,
  color: '#FFD700',
  mode: 'cube',
  rotation: 0,
  gravity: 0.5,
  jumpForce: -10
})

const generateLevel = (): { obstacles: Obstacle[]; portals: Portal[] } => {
  const obstacles: Obstacle[] = []
  const portals: Portal[] = []

  // Блоки
  for (let i = 0; i < 10; i++) {
    obstacles.push({
      x: 400 + i * 300,
      y: GROUND_Y - 40,
      width: 30,
      height: 40,
      type: 'block'
    })
  }
  // Шип
  obstacles.push({
    x: 800,
    y: GROUND_Y - 20,
    width: 30,
    height: 20,
    type: 'spike'
  })
  // Портал в режим корабля
  portals.push({
    x: 600,
    mode: 'ship'
  })
  return { obstacles, portals }
}

const GeometryDash: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [gameState, setGameState] = useState<GameState>(() => {
    const { obstacles, portals } = generateLevel()
    return {
      player: createInitialPlayer(),
      obstacles,
      portals,
      particles: [],
      cameraX: 0,
      score: 0,
      gameOver: false,
      gameStarted: false,
      speed: BASE_SPEED
    }
  })

  const [isJumping, setIsJumping] = useState(false)
  const [showScores, setShowScores] = useState(false)
  const { initSounds, startMusic, stopMusic } = useSounds()

  useEffect(() => {
    initSounds()
  }, [initSounds])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault()
        if (!gameState.gameStarted) {
          setGameState(prev => ({ ...prev, gameStarted: true }))
          startMusic()
        } else if (!gameState.gameOver) {
          setIsJumping(true)
        }
      }
    }
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        setIsJumping(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [gameState.gameStarted, gameState.gameOver, startMusic])

  // const update = useCallback(
  //   (deltaTime: number) => {
  //     setGameState(prev => {
  //       if (!prev.gameStarted || prev.gameOver) return prev

  //       // Нормируем дельту для стабильности
  //       const dt = Math.min(deltaTime / 16, 2) // примерно 60 FPS

  //       let newPlayer = { ...prev.player }
  //       let newObstacles = [...prev.obstacles]
  //       let newPortals = [...prev.portals]
  //       let newParticles = [...prev.particles]
  //       let gameOver = false

  //       // Гравитация
  //       newPlayer.vel.y += newPlayer.gravity * dt

  //       // Прыжок
  //       if (isJumping && newPlayer.isGrounded) {
  //         newPlayer.vel.y = newPlayer.jumpForce
  //         newPlayer.isGrounded = false
  //         playJump()
  //       }

  //       // Обновление позиции
  //       newPlayer.pos.y += newPlayer.vel.y * dt

  //       // Коллизия с землёй
  //       if (newPlayer.pos.y + newPlayer.size > GROUND_Y) {
  //         newPlayer.pos.y = GROUND_Y - newPlayer.size
  //         newPlayer.vel.y = 0
  //         newPlayer.isGrounded = true
  //       } else {
  //         newPlayer.isGrounded = false
  //       }

  //       // Сдвигаем мир влево (игрок стоит на месте)
  //       const scroll = prev.speed * dt
  //       newObstacles = newObstacles.map(obs => ({ ...obs, x: obs.x - scroll }))
  //       newPortals = newPortals.map(portal => ({ ...portal, x: portal.x - scroll }))
  //       newParticles = newParticles.map(p => ({ ...p, x: p.x - scroll }))

  //       // Убираем объекты, ушедшие за левый край
  //       newObstacles = newObstacles.filter(obs => obs.x + obs.width > 0)
  //       newPortals = newPortals.filter(portal => portal.x > -50)

  //       for (const obs of newObstacles) {
  //         if (
  //           newPlayer.pos.x < obs.x + obs.width &&
  //           newPlayer.pos.x + newPlayer.size > obs.x &&
  //           newPlayer.pos.y < obs.y + obs.height &&
  //           newPlayer.pos.y + newPlayer.size > obs.y
  //         ) {
  //           gameOver = true
  //           stopMusic()
  //           playDeath()
  //           // Создаём частицы при смерти
  //           for (let i = 0; i < 20; i++) {
  //             newParticles.push({
  //               x: newPlayer.pos.x + newPlayer.size / 2,
  //               y: newPlayer.pos.y + newPlayer.size / 2,
  //               vx: (Math.random() - 0.5) * 10,
  //               vy: (Math.random() - 0.5) * 10,
  //               life: 1.0,
  //               color: newPlayer.color
  //             })
  //           }
  //           break
  //         }
  //       }

  //       for (const portal of newPortals) {
  //         if (Math.abs(portal.x - PLAYER_START_X) < 10) {
  //           // игрок стоит на месте, проверяем по x портала
  //           newPlayer.mode = portal.mode
  //           // Здесь можно менять физику под новый режим
  //           // Для примера оставим
  //         }
  //       }

  //       newParticles = newParticles
  //         .map(p => ({
  //           ...p,
  //           x: p.x + p.vx,
  //           y: p.y + p.vy,
  //           vy: p.vy + 0.2, // гравитация частиц
  //           life: p.life - 0.01
  //         }))
  //         .filter(p => p.life > 0)

  //       if (newObstacles.length < 5 && Math.random() < 0.01) {
  //         const lastX = newObstacles.length > 0 ? Math.max(...newObstacles.map(o => o.x)) : 0
  //         if (lastX < CANVAS_WIDTH) {
  //           newObstacles.push({
  //             x: CANVAS_WIDTH + 200,
  //             y: GROUND_Y - 40,
  //             width: 30,
  //             height: 40,
  //             type: 'block'
  //           })
  //         }
  //       }

  //       const newScore = prev.score + prev.speed * dt * 0.1

  //       return {
  //         ...prev,
  //         player: newPlayer,
  //         obstacles: newObstacles,
  //         portals: newPortals,
  //         particles: newParticles,
  //         cameraX: prev.cameraX + scroll,
  //         score: newScore,
  //         gameOver
  //       }
  //     })
  //   },
  //   [isJumping, playJump, playDeath, stopMusic]
  // )

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    console.log(isJumping)

    const draw = () => {
      ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

      // Пол
      ctx.fillStyle = '#333'
      ctx.fillRect(0, GROUND_Y, CANVAS_WIDTH, CANVAS_HEIGHT - GROUND_Y)

      // Препятствия
      gameState.obstacles.forEach(obs => {
        ctx.fillStyle = obs.type === 'spike' ? '#FF0000' : '#888'
        ctx.fillRect(obs.x, obs.y, obs.width, obs.height)
      })

      // Порталы (просто кружок для демонстрации)
      gameState.portals.forEach(portal => {
        ctx.fillStyle = '#00FF00'
        ctx.beginPath()
        ctx.arc(portal.x + 15, GROUND_Y - 50, 20, 0, 2 * Math.PI)
        ctx.fill()
      })

      // Частицы
      gameState.particles.forEach(p => {
        ctx.globalAlpha = p.life
        ctx.fillStyle = p.color
        ctx.fillRect(p.x - 2, p.y - 2, 4, 4)
      })
      ctx.globalAlpha = 1.0

      // Игрок (с вращением)
      ctx.save()
      ctx.translate(
        gameState.player.pos.x + gameState.player.size / 2,
        gameState.player.pos.y + gameState.player.size / 2
      )
      ctx.rotate((gameState.player.rotation * Math.PI) / 180)
      ctx.fillStyle = gameState.player.color
      ctx.fillRect(
        -gameState.player.size / 2,
        -gameState.player.size / 2,
        gameState.player.size,
        gameState.player.size
      )
      ctx.restore()

      // Текст
      ctx.fillStyle = 'white'
      ctx.font = '20px Arial'
      ctx.fillText(`Score: ${Math.floor(gameState.score)}`, 10, 30)
      ctx.fillText(`Mode: ${gameState.player.mode}`, 10, 60)

      if (!gameState.gameStarted) {
        ctx.fillStyle = 'white'
        ctx.font = '30px Arial'
        ctx.fillText('Press SPACE to start', 200, 200)
      }
      if (gameState.gameOver) {
        ctx.fillStyle = 'red'
        ctx.font = '40px Arial'
        ctx.fillText('GAME OVER', 200, 200)
      }
    }
    draw()
  }, [gameState])

  const restart = () => {
    const { obstacles, portals } = generateLevel()
    setGameState({
      player: createInitialPlayer(),
      obstacles,
      portals,
      particles: [],
      cameraX: 0,
      score: 0,
      gameOver: false,
      gameStarted: false,
      speed: BASE_SPEED
    })
    setIsJumping(false)
    stopMusic()
  }

  return (
    <div className={styles.gameContainer}>
      <canvas
        ref={canvasRef}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        className={styles.canvas}
      />
      <button onClick={restart} className={styles.restartButton}>
        Restart
      </button>
      <button onClick={() => setShowScores(true)}>High Scores</button>
      {showScores && (
        <HighScores
          currentScore={Math.floor(gameState.score)}
          onClose={() => setShowScores(false)}
        />
      )}
    </div>
  )
}

export default GeometryDash
