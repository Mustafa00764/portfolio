import React, { useRef, useEffect, useState } from 'react'
import styles from './Gorillas.module.css'

interface Building {
  x: number
  width: number
  height: number
  lightsOn?: boolean[]
}

interface BackgroundBuilding {
  x: number
  width: number
  height: number
}

interface BlastHole {
  x: number
  y: number
}

interface Bomb {
  x: number
  y: number
  rotation: number
  velocity: { x: number; y: number }
  highlight: boolean
}

interface GameState {
  phase: 'aiming' | 'in flight' | 'celebrating'
  currentPlayer: 1 | 2
  round: number
  windSpeed: number
  bomb: Bomb
  backgroundBuildings: BackgroundBuilding[]
  buildings: Building[]
  blastHoles: BlastHole[]
  stars: { x: number; y: number }[]
  scale: number
  shift: number
}

interface Settings {
  numberOfPlayers: 0 | 1 | 2
  mode: 'dark' | 'light'
}

const BLAST_HOLE_RADIUS = 18
const GORILLA_HAND_OFFSET = { x: 28, y: 107 }

const Gorillas: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const windmillRef = useRef<SVGSVGElement>(null)
  const windmillHeadRef = useRef<SVGGElement>(null)
  const windInfoRef = useRef<HTMLDivElement>(null)
  const windSpeedRef = useRef<HTMLSpanElement>(null)
  const infoLeftRef = useRef<HTMLDivElement>(null)
  const name1Ref = useRef<HTMLSpanElement>(null)
  const angle1Ref = useRef<HTMLSpanElement>(null)
  const velocity1Ref = useRef<HTMLSpanElement>(null)
  const infoRightRef = useRef<HTMLDivElement>(null)
  const name2Ref = useRef<HTMLSpanElement>(null)
  const angle2Ref = useRef<HTMLSpanElement>(null)
  const velocity2Ref = useRef<HTMLSpanElement>(null)
  const instructionsRef = useRef<HTMLDivElement>(null)
  const gameModeRef = useRef<HTMLHeadingElement>(null)
  const bombGrabAreaRef = useRef<HTMLDivElement>(null)
  const congratulationsRef = useRef<HTMLDivElement>(null)
  const winnerRef = useRef<HTMLSpanElement>(null)
  const settingsRef = useRef<HTMLDivElement>(null)
  const colorModeButtonRef = useRef<HTMLButtonElement>(null)
  // const enterFullscreenRef = useRef<SVGPathElement>(null)
  // const exitFullscreenRef = useRef<SVGPathElement>(null)

  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 })

  const [settings, setSettings] = useState<Settings>(() => {
    const darkMQ = window.matchMedia('(prefers-color-scheme: dark)')
    return {
      numberOfPlayers: 1,
      mode: darkMQ.matches ? 'dark' : 'light'
    }
  })

  const settingsStateRef = useRef<Settings>(settings)

  useEffect(() => {
    settingsStateRef.current = settings
  }, [settings])

  const gameState = useRef<GameState>(null as unknown as GameState)
  const isDragging = useRef(false)
  const dragStartX = useRef<number>(0)
  const dragStartY = useRef<number>(0)
  const previousAnimationTimestamp = useRef<number | undefined>(undefined)
  const animationFrameRequestID = useRef<number | undefined>(undefined)
  const delayTimeoutID = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const simulationMode = useRef(false)
  const simulationImpact = useRef<{ x: number; y: number }>({ x: 0, y: 0 })

  const getCtx = (): CanvasRenderingContext2D | null => {
    const canvas = canvasRef.current
    if (!canvas) return null
    return canvas.getContext('2d')
  }

  useEffect(() => {
    if (!containerRef.current) return

    const resizeObserver = new ResizeObserver(entries => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect
        setContainerSize({ width, height })
      }
    })

    resizeObserver.observe(containerRef.current)
    return () => resizeObserver.disconnect()
  }, [])

  useEffect(() => {
    if (!canvasRef.current || containerSize.width === 0 || containerSize.height === 0) return

    const canvas = canvasRef.current
    const dpr = window.devicePixelRatio || 1

    canvas.width = containerSize.width * dpr
    canvas.height = containerSize.height * dpr
    canvas.style.width = `${containerSize.width}px`
    canvas.style.height = `${containerSize.height}px`

    if (gameState.current) {
      calculateScaleAndShift()
      initializeBombPosition()
      initializeWindmillPosition()
      draw()
    }
  }, [containerSize])

  const generateWindSpeed = () => -10 + Math.random() * 20

  const clearRunningTimers = () => {
    if (animationFrameRequestID.current) {
      cancelAnimationFrame(animationFrameRequestID.current)
      animationFrameRequestID.current = undefined
    }

    if (delayTimeoutID.current) {
      clearTimeout(delayTimeoutID.current)
      delayTimeoutID.current = undefined
    }

    previousAnimationTimestamp.current = undefined
    isDragging.current = false
    document.body.style.cursor = 'default'
  }

  const newGame = () => {
    clearRunningTimers()

    const windSpeed = generateWindSpeed()

    gameState.current = {
      phase: 'aiming',
      currentPlayer: 1,
      round: 1,
      windSpeed,
      bomb: {
        x: 0,
        y: 0,
        rotation: 0,
        velocity: { x: 0, y: 0 },
        highlight: true
      },
      backgroundBuildings: [],
      buildings: [],
      blastHoles: [],
      stars: [],
      scale: 1,
      shift: 0
    }

    const starCount = (containerSize.width * containerSize.height) / 12000
    for (let i = 0; i < starCount; i++) {
      gameState.current.stars.push({
        x: Math.floor(Math.random() * containerSize.width),
        y: Math.floor(Math.random() * containerSize.height)
      })
    }

    for (let i = 0; i < 17; i++) generateBackgroundBuilding(i)
    for (let i = 0; i < 8; i++) generateBuilding(i)

    calculateScaleAndShift()
    initializeBombPosition()
    initializeWindmillPosition()
    setWindMillRotation()

    if (settingsStateRef.current.numberOfPlayers > 0) showInstructions()
    else hideInstructions()

    hideCongratulations()

    if (angle1Ref.current) angle1Ref.current.innerText = '0'
    if (velocity1Ref.current) velocity1Ref.current.innerText = '0'
    if (angle2Ref.current) angle2Ref.current.innerText = '0'
    if (velocity2Ref.current) velocity2Ref.current.innerText = '0'

    simulationMode.current = false
    simulationImpact.current = { x: 0, y: 0 }

    draw()

    if (settingsStateRef.current.numberOfPlayers === 0) {
      computerThrow()
    }
  }

  const generateBackgroundBuilding = (index: number) => {
    const prev = gameState.current.backgroundBuildings[index - 1]
    const x = prev ? prev.x + prev.width + 4 : -300

    const minW = 60
    const maxW = 110
    const width = minW + Math.random() * (maxW - minW)

    const smaller = index < 4 || index >= 13
    const minH = smaller ? 20 : 80
    const maxH = smaller ? 150 : 350
    const height = minH + Math.random() * (maxH - minH)

    gameState.current.backgroundBuildings.push({ x, width, height })
  }

  const generateBuilding = (index: number) => {
    const prev = gameState.current.buildings[index - 1]
    const x = prev ? prev.x + prev.width + 4 : 0

    const minW = 80
    const maxW = 130
    const width = minW + Math.random() * (maxW - minW)

    const smaller = index <= 1 || index >= 6
    const minH = smaller ? 30 : 40
    const maxH = smaller ? 150 : 300
    const height = minH + Math.random() * (maxH - minH)

    const lightsOn = Array.from({ length: 50 }, () => Math.random() <= 0.33)

    gameState.current.buildings.push({ x, width, height, lightsOn })
  }

  const calculateScaleAndShift = () => {
    const last = gameState.current.buildings[gameState.current.buildings.length - 1]
    const totalWidth = last.x + last.width
    const horizontalScale = containerSize.width / totalWidth
    const verticalScale = containerSize.height / 500

    gameState.current.scale = Math.min(horizontalScale, verticalScale)
    gameState.current.shift =
      horizontalScale > verticalScale
        ? (containerSize.width - totalWidth * gameState.current.scale) / 2
        : 0
  }

  const initializeBombPosition = () => {
    const { currentPlayer, buildings, scale, shift } = gameState.current
    const building = currentPlayer === 1 ? buildings[1] : buildings[buildings.length - 2]

    const gorillaX = building.x + building.width / 2
    const gorillaY = building.height
    const offsetX = currentPlayer === 1 ? -GORILLA_HAND_OFFSET.x : GORILLA_HAND_OFFSET.x

    gameState.current.bomb.x = gorillaX + offsetX
    gameState.current.bomb.y = gorillaY + GORILLA_HAND_OFFSET.y
    gameState.current.bomb.velocity = { x: 0, y: 0 }
    gameState.current.bomb.rotation = 0

    if (bombGrabAreaRef.current) {
      const grabRadius = 15
      const left = gameState.current.bomb.x * scale + shift - grabRadius
      const bottom = gameState.current.bomb.y * scale - grabRadius
      bombGrabAreaRef.current.style.left = `${left}px`
      bombGrabAreaRef.current.style.bottom = `${bottom}px`
    }
  }

  const initializeWindmillPosition = () => {
    const last = gameState.current.buildings[gameState.current.buildings.length - 1]
    const rooftopY = last.height * gameState.current.scale
    const rooftopX = (last.x + last.width / 2) * gameState.current.scale + gameState.current.shift

    if (windmillRef.current) {
      windmillRef.current.style.bottom = `${rooftopY}px`
      windmillRef.current.style.left = `${rooftopX - 100}px`
      windmillRef.current.style.scale = String(gameState.current.scale)
    }

    if (windInfoRef.current) {
      // windInfoRef.current.style.bottom = `${rooftopY}px`
      // windInfoRef.current.style.left = `${rooftopX}px`
    }
  }

  const setWindMillRotation = () => {
    const speed = gameState.current.windSpeed || 0.0001
    const rotationSpeed = Math.abs(50 / speed)

    if (windmillHeadRef.current) {
      windmillHeadRef.current.style.animationDirection = speed > 0 ? 'normal' : 'reverse'
      windmillHeadRef.current.style.animationDuration = `${rotationSpeed}s`
    }

    if (windSpeedRef.current) {
      windSpeedRef.current.innerText = Math.round(gameState.current.windSpeed).toString()
    }
  }

  const showInstructions = () => {
    if (instructionsRef.current) {
      instructionsRef.current.style.opacity = '1'
      instructionsRef.current.style.visibility = 'visible'
    }
  }

  const hideInstructions = () => {
    if (gameState.current) {
      gameState.current.bomb.highlight = false
    }

    if (instructionsRef.current) {
      instructionsRef.current.style.opacity = '0'
      instructionsRef.current.style.visibility = 'hidden'
    }
  }

  const showCongratulations = () => {
    if (congratulationsRef.current) {
      congratulationsRef.current.style.opacity = '1'
      congratulationsRef.current.style.visibility = 'visible'
    }
  }

  const hideCongratulations = () => {
    if (congratulationsRef.current) {
      congratulationsRef.current.style.opacity = '0'
      congratulationsRef.current.style.visibility = 'hidden'
    }
  }

  const drawBackgroundSky = (ctx: CanvasRenderingContext2D) => {
    const gradient = ctx.createLinearGradient(0, 0, 0, containerSize.height)

    if (settings.mode === 'dark') {
      gradient.addColorStop(1, '#27507F')
      gradient.addColorStop(0, '#58A8D8')
    } else {
      gradient.addColorStop(1, '#F8BA85')
      gradient.addColorStop(0, '#FFC28E')
    }

    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, containerSize.width, containerSize.height)

    if (settings.mode === 'dark') {
      ctx.fillStyle = 'white'
      gameState.current.stars.forEach(star => {
        ctx.fillRect(star.x, star.y, 1, 1)
      })
    }
  }

  const drawBackgroundMoon = (ctx: CanvasRenderingContext2D) => {
    const { scale, shift } = gameState.current

    ctx.fillStyle = 'rgba(255,255,255,0.6)'
    ctx.beginPath()

    if (settings.mode === 'dark') {
      ctx.arc(
        containerSize.width / scale - shift - 200,
        containerSize.height / scale - 100,
        30,
        0,
        2 * Math.PI
      )
    } else {
      ctx.arc(300, 350, 60, 0, 2 * Math.PI)
    }

    ctx.fill()
  }

  const drawBackgroundBuildings = (ctx: CanvasRenderingContext2D) => {
    ctx.fillStyle = settings.mode === 'dark' ? '#254D7E' : '#947285'
    gameState.current.backgroundBuildings.forEach(b => {
      ctx.fillRect(b.x, 0, b.width, b.height)
    })
  }

  const drawBuildings = (ctx: CanvasRenderingContext2D) => {
    gameState.current.buildings.forEach(b => {
      ctx.fillStyle = settings.mode === 'dark' ? '#152A47' : '#4A3C68'
      ctx.fillRect(b.x, 0, b.width, b.height)

      const windowW = 10
      const windowH = 12
      const gap = 15
      const floors = Math.ceil((b.height - gap) / (windowH + gap))
      const rooms = Math.floor((b.width - gap) / (windowW + gap))

      for (let floor = 0; floor < floors; floor++) {
        for (let room = 0; room < rooms; room++) {
          if (b.lightsOn && b.lightsOn[floor * rooms + room]) {
            ctx.save()
            ctx.translate(b.x + gap, b.height - gap)
            ctx.scale(1, -1)
            ctx.fillStyle = settings.mode === 'dark' ? '#5F76AB' : '#EBB6A2'
            ctx.fillRect(room * (windowW + gap), floor * (windowH + gap), windowW, windowH)
            ctx.restore()
          }
        }
      }
    })
  }

  const drawBuildingsWithBlastHoles = (ctx: CanvasRenderingContext2D) => {
    ctx.save()

    gameState.current.blastHoles.forEach(hole => {
      ctx.beginPath()
      ctx.rect(
        0,
        0,
        containerSize.width / gameState.current.scale,
        containerSize.height / gameState.current.scale
      )
      ctx.arc(hole.x, hole.y, BLAST_HOLE_RADIUS, 0, 2 * Math.PI, true)
      ctx.clip()
    })

    drawBuildings(ctx)
    ctx.restore()
  }

  const drawGorillaBody = (ctx: CanvasRenderingContext2D) => {
    ctx.fillStyle = 'black'
    ctx.beginPath()
    ctx.moveTo(0, 15)
    ctx.lineTo(-7, 0)
    ctx.lineTo(-20, 0)
    ctx.lineTo(-17, 18)
    ctx.lineTo(-20, 44)
    ctx.lineTo(-11, 77)
    ctx.lineTo(0, 84)
    ctx.lineTo(11, 77)
    ctx.lineTo(20, 44)
    ctx.lineTo(17, 18)
    ctx.lineTo(20, 0)
    ctx.lineTo(7, 0)
    ctx.fill()
  }

  const drawGorillaLeftArm = (ctx: CanvasRenderingContext2D, player: 1 | 2) => {
    const { phase, currentPlayer, bomb } = gameState.current

    ctx.strokeStyle = 'black'
    ctx.lineWidth = 18
    ctx.beginPath()
    ctx.moveTo(-14, 50)

    if (phase === 'aiming' && currentPlayer === 1 && player === 1) {
      ctx.quadraticCurveTo(-44, 63, -28 - bomb.velocity.x / 6.25, 107 - bomb.velocity.y / 6.25)
    } else if (phase === 'celebrating' && currentPlayer === player) {
      ctx.quadraticCurveTo(-44, 63, -28, 107)
    } else {
      ctx.quadraticCurveTo(-44, 45, -28, 12)
    }

    ctx.stroke()
  }

  const drawGorillaRightArm = (ctx: CanvasRenderingContext2D, player: 1 | 2) => {
    const { phase, currentPlayer, bomb } = gameState.current

    ctx.strokeStyle = 'black'
    ctx.lineWidth = 18
    ctx.beginPath()
    ctx.moveTo(14, 50)

    if (phase === 'aiming' && currentPlayer === 2 && player === 2) {
      ctx.quadraticCurveTo(44, 63, 28 - bomb.velocity.x / 6.25, 107 - bomb.velocity.y / 6.25)
    } else if (phase === 'celebrating' && currentPlayer === player) {
      ctx.quadraticCurveTo(44, 63, 28, 107)
    } else {
      ctx.quadraticCurveTo(44, 45, 28, 12)
    }

    ctx.stroke()
  }

  const drawGorillaFace = (ctx: CanvasRenderingContext2D, player: 1 | 2) => {
    const { phase, currentPlayer } = gameState.current

    ctx.fillStyle = settings.mode === 'dark' ? 'gray' : 'lightgray'
    ctx.beginPath()
    ctx.arc(0, 63, 9, 0, 2 * Math.PI)
    ctx.moveTo(-3.5, 70)
    ctx.arc(-3.5, 70, 4, 0, 2 * Math.PI)
    ctx.moveTo(3.5, 70)
    ctx.arc(3.5, 70, 4, 0, 2 * Math.PI)
    ctx.fill()

    ctx.fillStyle = 'black'
    ctx.beginPath()
    ctx.arc(-3.5, 70, 1.4, 0, 2 * Math.PI)
    ctx.moveTo(3.5, 70)
    ctx.arc(3.5, 70, 1.4, 0, 2 * Math.PI)
    ctx.fill()

    ctx.strokeStyle = 'black'
    ctx.lineWidth = 1.4
    ctx.beginPath()
    ctx.moveTo(-3.5, 66.5)
    ctx.lineTo(-1.5, 65)
    ctx.moveTo(3.5, 66.5)
    ctx.lineTo(1.5, 65)
    ctx.stroke()

    ctx.beginPath()
    if (phase === 'celebrating' && currentPlayer === player) {
      ctx.moveTo(-5, 60)
      ctx.quadraticCurveTo(0, 56, 5, 60)
    } else {
      ctx.moveTo(-5, 56)
      ctx.quadraticCurveTo(0, 60, 5, 56)
    }
    ctx.stroke()
  }

  const drawGorillaThoughtBubbles = (ctx: CanvasRenderingContext2D, player: 1 | 2) => {
    const { phase, currentPlayer } = gameState.current
    const playersMode = settingsStateRef.current.numberOfPlayers

    if (phase !== 'aiming') return

    const isComputer =
      (playersMode === 0 && currentPlayer === 1 && player === 1) ||
      (playersMode !== 2 && currentPlayer === 2 && player === 2)

    if (!isComputer) return

    ctx.save()
    ctx.scale(1, -1)
    ctx.font = '20px sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText('?', 0, -90)
    ctx.font = '10px sans-serif'
    ctx.rotate((5 / 180) * Math.PI)
    ctx.fillText('?', 0, -90)
    ctx.rotate((-10 / 180) * Math.PI)
    ctx.fillText('?', 0, -90)
    ctx.restore()
  }

  const drawGorilla = (ctx: CanvasRenderingContext2D, player: 1 | 2) => {
    const building =
      player === 1
        ? gameState.current.buildings[1]
        : gameState.current.buildings[gameState.current.buildings.length - 2]

    ctx.save()
    ctx.translate(building.x + building.width / 2, building.height)
    drawGorillaBody(ctx)
    drawGorillaLeftArm(ctx, player)
    drawGorillaRightArm(ctx, player)
    drawGorillaFace(ctx, player)
    drawGorillaThoughtBubbles(ctx, player)
    ctx.restore()
  }

  const drawBomb = (ctx: CanvasRenderingContext2D) => {
    const { bomb, phase, scale } = gameState.current

    ctx.save()
    ctx.translate(bomb.x, bomb.y)

    if (phase === 'aiming') {
      ctx.translate(-bomb.velocity.x / 6.25, -bomb.velocity.y / 6.25)
      ctx.strokeStyle = 'rgba(255,255,255,0.7)'
      ctx.setLineDash([3, 8])
      ctx.lineWidth = 3
      ctx.beginPath()
      ctx.moveTo(0, 0)
      ctx.lineTo(bomb.velocity.x, bomb.velocity.y)
      ctx.stroke()
      ctx.setLineDash([])

      ctx.fillStyle = 'white'
      ctx.beginPath()
      ctx.arc(0, 0, 6, 0, 2 * Math.PI)
      ctx.fill()
    } else if (phase === 'in flight') {
      ctx.fillStyle = 'white'
      ctx.rotate(bomb.rotation)
      ctx.beginPath()
      ctx.moveTo(-8, -2)
      ctx.quadraticCurveTo(0, 12, 8, -2)
      ctx.quadraticCurveTo(0, 2, -8, -2)
      ctx.fill()
    } else {
      ctx.fillStyle = 'white'
      ctx.beginPath()
      ctx.arc(0, 0, 6, 0, 2 * Math.PI)
      ctx.fill()
    }

    ctx.restore()

    if (bomb.y > containerSize.height / scale) {
      ctx.beginPath()
      ctx.strokeStyle = 'white'
      const dist = bomb.y - containerSize.height / scale
      ctx.moveTo(bomb.x, containerSize.height / scale - 9.5)
      ctx.lineTo(bomb.x, containerSize.height / scale - dist)
      ctx.moveTo(bomb.x, containerSize.height / scale - 10)
      ctx.lineTo(bomb.x - 5, containerSize.height / scale - 20)
      ctx.moveTo(bomb.x, containerSize.height / scale - 10)
      ctx.lineTo(bomb.x + 5, containerSize.height / scale - 20)
      ctx.stroke()
    }

    if (bomb.highlight) {
      ctx.beginPath()
      ctx.strokeStyle = 'white'
      ctx.lineWidth = 2
      ctx.moveTo(bomb.x, bomb.y + 19.5)
      ctx.lineTo(bomb.x, bomb.y + 120)
      ctx.moveTo(bomb.x, bomb.y + 20)
      ctx.lineTo(bomb.x - 5, bomb.y + 30)
      ctx.moveTo(bomb.x, bomb.y + 20)
      ctx.lineTo(bomb.x + 5, bomb.y + 30)
      ctx.stroke()
    }
  }

  const draw = () => {
    const ctx = getCtx()
    if (!ctx || containerSize.width === 0 || containerSize.height === 0 || !gameState.current)
      return

    ctx.save()
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio)
    ctx.clearRect(0, 0, containerSize.width, containerSize.height)

    drawBackgroundSky(ctx)

    ctx.translate(0, containerSize.height)
    ctx.scale(1, -1)
    ctx.translate(gameState.current.shift, 0)
    ctx.scale(gameState.current.scale, gameState.current.scale)

    drawBackgroundMoon(ctx)
    drawBackgroundBuildings(ctx)
    drawBuildingsWithBlastHoles(ctx)
    drawGorilla(ctx, 1)
    drawGorilla(ctx, 2)
    drawBomb(ctx)

    ctx.restore()
  }

  const moveBomb = (elapsed: number) => {
    const mult = elapsed / 200
    const state = gameState.current

    state.bomb.velocity.x += state.windSpeed * mult
    state.bomb.velocity.y -= 20 * mult
    state.bomb.x += state.bomb.velocity.x * mult
    state.bomb.y += state.bomb.velocity.y * mult

    const dir = state.currentPlayer === 1 ? -1 : 1
    state.bomb.rotation += dir * 5 * mult
  }

  const checkFrameHit = (): boolean => {
    const { bomb, shift, scale } = gameState.current
    return bomb.y < 0 || bomb.x < -shift / scale || bomb.x > (containerSize.width - shift) / scale
  }

  const checkBuildingHit = (): boolean => {
    const { bomb, buildings, blastHoles } = gameState.current

    for (const b of buildings) {
      if (bomb.x + 4 > b.x && bomb.x - 4 < b.x + b.width && bomb.y - 4 < b.height) {
        for (const hole of blastHoles) {
          const dx = bomb.x - hole.x
          const dy = bomb.y - hole.y
          if (Math.sqrt(dx * dx + dy * dy) < BLAST_HOLE_RADIUS) {
            return false
          }
        }

        if (!simulationMode.current) {
          blastHoles.push({ x: bomb.x, y: bomb.y })
        }

        return true
      }
    }

    return false
  }

  const checkGorillaHit = (): boolean => {
    const enemy = gameState.current.currentPlayer === 1 ? 2 : 1
    const building =
      enemy === 1
        ? gameState.current.buildings[1]
        : gameState.current.buildings[gameState.current.buildings.length - 2]
    const ctx = getCtx()
    if (!ctx) return false

    ctx.save()
    ctx.translate(building.x + building.width / 2, building.height)
    drawGorillaBody(ctx)
    let hit = ctx.isPointInPath(gameState.current.bomb.x, gameState.current.bomb.y)
    drawGorillaLeftArm(ctx, enemy)
    hit = hit || ctx.isPointInStroke(gameState.current.bomb.x, gameState.current.bomb.y)
    drawGorillaRightArm(ctx, enemy)
    hit = hit || ctx.isPointInStroke(gameState.current.bomb.x, gameState.current.bomb.y)
    ctx.restore()
    return hit
  }

  const announceWinner = () => {
    const playersMode = settingsStateRef.current.numberOfPlayers
    let text = ''

    if (playersMode === 0) {
      text = `Computer ${gameState.current.currentPlayer}`
    } else if (playersMode === 1 && gameState.current.currentPlayer === 1) {
      text = 'You'
    } else if (playersMode === 1 && gameState.current.currentPlayer === 2) {
      text = 'Computer'
    } else {
      text = `Player ${gameState.current.currentPlayer}`
    }

    if (winnerRef.current) {
      winnerRef.current.innerText = text
    }

    showCongratulations()
  }

  const throwBomb = () => {
    isDragging.current = false

    if (simulationMode.current) {
      previousAnimationTimestamp.current = 0
      animate(16)
    } else {
      gameState.current.phase = 'in flight'
      previousAnimationTimestamp.current = undefined
      animationFrameRequestID.current = requestAnimationFrame(animate)
    }
  }

  const animate = (timestamp: number) => {
    if (previousAnimationTimestamp.current === undefined) {
      previousAnimationTimestamp.current = timestamp
      animationFrameRequestID.current = requestAnimationFrame(animate)
      return
    }

    const elapsed = timestamp - previousAnimationTimestamp.current
    const steps = 10

    for (let i = 0; i < steps; i++) {
      moveBomb(elapsed / steps)

      // СНАЧАЛА проверяем попадание в гориллу
      const hit = checkGorillaHit()

      // И только если не попали в гориллу — проверяем промах/здание
      const miss = !hit && (checkFrameHit() || checkBuildingHit())

      if (simulationMode.current && (hit || miss)) {
        simulationImpact.current = {
          x: gameState.current.bomb.x,
          y: gameState.current.bomb.y
        }
        return
      }

      if (hit) {
        gameState.current.phase = 'celebrating'
        draw()
        announceWinner()
        return
      }

      if (miss) {
        gameState.current.currentPlayer = gameState.current.currentPlayer === 1 ? 2 : 1

        if (gameState.current.currentPlayer === 1) {
          gameState.current.round++
        }

        gameState.current.phase = 'aiming'
        initializeBombPosition()
        draw()

        const playersMode = settingsStateRef.current.numberOfPlayers
        const computerNext =
          playersMode === 0 || (playersMode === 1 && gameState.current.currentPlayer === 2)

        if (computerNext) {
          delayTimeoutID.current = setTimeout(computerThrow, 50)
        }

        return
      }
    }

    if (!simulationMode.current) {
      draw()
    }

    previousAnimationTimestamp.current = timestamp

    if (simulationMode.current) {
      animate(timestamp + 16)
    } else {
      animationFrameRequestID.current = requestAnimationFrame(animate)
    }
  }

  const computerThrow = () => {
    const simulations = 2 + gameState.current.round * 3
    const best = runSimulations(simulations)

    initializeBombPosition()
    gameState.current.bomb.velocity.x = best.velocityX
    gameState.current.bomb.velocity.y = best.velocityY
    setInfo(best.velocityX, best.velocityY)
    draw()

    delayTimeoutID.current = setTimeout(throwBomb, 1000)
  }

  const runSimulations = (count: number) => {
    let best = { velocityX: 0, velocityY: 0, distance: Infinity }
    simulationMode.current = true

    const enemy =
      gameState.current.currentPlayer === 1
        ? gameState.current.buildings[gameState.current.buildings.length - 2]
        : gameState.current.buildings[1]

    const enemyX = enemy.x + enemy.width / 2
    const enemyY = enemy.height + 30

    for (let i = 0; i < count; i++) {
      const angleDeg = -10 + Math.random() * 100
      const angleRad = (angleDeg / 180) * Math.PI
      const vel = 40 + Math.random() * 130
      const dir = gameState.current.currentPlayer === 1 ? 1 : -1
      const vx = Math.cos(angleRad) * vel * dir
      const vy = Math.sin(angleRad) * vel

      initializeBombPosition()
      gameState.current.bomb.velocity.x = vx
      gameState.current.bomb.velocity.y = vy
      throwBomb()

      const dx = enemyX - simulationImpact.current.x
      const dy = enemyY - simulationImpact.current.y
      const dist = Math.sqrt(dx * dx + dy * dy)

      if (dist < best.distance) {
        best = { velocityX: vx, velocityY: vy, distance: dist }
      }
    }

    simulationMode.current = false
    return best
  }

  const setInfo = (deltaX: number, deltaY: number) => {
    const hyp = Math.sqrt(deltaX ** 2 + deltaY ** 2)

    if (hyp === 0) {
      if (gameState.current.currentPlayer === 1) {
        if (angle1Ref.current) angle1Ref.current.innerText = '0'
        if (velocity1Ref.current) velocity1Ref.current.innerText = '0'
      } else {
        if (angle2Ref.current) angle2Ref.current.innerText = '0'
        if (velocity2Ref.current) velocity2Ref.current.innerText = '0'
      }
      return
    }

    const angleRad = Math.asin(deltaY / hyp)
    const angleDeg = (angleRad / Math.PI) * 180

    if (gameState.current.currentPlayer === 1) {
      if (angle1Ref.current) angle1Ref.current.innerText = Math.round(angleDeg).toString()
      if (velocity1Ref.current) velocity1Ref.current.innerText = Math.round(hyp).toString()
    } else {
      if (angle2Ref.current) angle2Ref.current.innerText = Math.round(angleDeg).toString()
      if (velocity2Ref.current) velocity2Ref.current.innerText = Math.round(hyp).toString()
    }
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()

    if (!gameState.current) return
    if (gameState.current.phase !== 'aiming') return

    hideInstructions()
    isDragging.current = true
    dragStartX.current = e.clientX
    dragStartY.current = e.clientY
    document.body.style.cursor = 'grabbing'
  }

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging.current) return
      if (!gameState.current || gameState.current.phase !== 'aiming') return

      const deltaX = e.clientX - dragStartX.current
      const deltaY = e.clientY - dragStartY.current

      gameState.current.bomb.velocity.x = -deltaX
      gameState.current.bomb.velocity.y = deltaY
      setInfo(deltaX, deltaY)
      draw()
    }

    const handleMouseUp = () => {
      if (!isDragging.current) return
      if (!gameState.current || gameState.current.phase !== 'aiming') return

      isDragging.current = false
      document.body.style.cursor = 'default'
      throwBomb()
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [containerSize.width, containerSize.height, settings.mode])

  useEffect(() => {
    if (containerSize.width > 0 && containerSize.height > 0) {
      newGame()
    }
  }, [settings.numberOfPlayers, containerSize])

  useEffect(() => {
    draw()
  }, [settings.mode])

  const applyGameMode = (
    mode: 0 | 1 | 2,
    gameModeText: string,
    leftName: string,
    rightName: string,
    e?: React.MouseEvent
  ) => {
    e?.preventDefault()

    if (gameModeRef.current) gameModeRef.current.innerHTML = gameModeText
    if (name1Ref.current) name1Ref.current.innerText = leftName
    if (name2Ref.current) name2Ref.current.innerText = rightName

    // Если выбран тот же режим — вручную перезапускаем игру
    if (settingsStateRef.current.numberOfPlayers === mode) {
      hideCongratulations()
      newGame()
      return
    }

    setSettings(prev => ({ ...prev, numberOfPlayers: mode }))
  }

  const setSinglePlayer = (e?: React.MouseEvent) => {
    applyGameMode(1, 'Player vs. Computer', 'Player', 'Computer', e)
  }

  const setTwoPlayers = (e?: React.MouseEvent) => {
    applyGameMode(2, 'Player vs. Player', 'Player 1', 'Player 2', e)
  }

  const setAutoPlay = (e?: React.MouseEvent) => {
    applyGameMode(0, 'Computer vs. Computer', 'Computer 1', 'Computer 2', e)
  }

  const toggleColorMode = () => {
    setSettings(prev => ({
      ...prev,
      mode: prev.mode === 'dark' ? 'light' : 'dark'
    }))
  }

  // const toggleFullscreen = () => {
  //   if (!document.fullscreenElement) {
  //     document.documentElement.requestFullscreen()
  //     enterFullscreenRef.current?.setAttribute('stroke', 'transparent')
  //     exitFullscreenRef.current?.setAttribute('stroke', 'white')
  //   } else {
  //     document.exitFullscreen()
  //     enterFullscreenRef.current?.setAttribute('stroke', 'white')
  //     exitFullscreenRef.current?.setAttribute('stroke', 'transparent')
  //   }
  // }

  useEffect(() => {
    const handleMouseMove = () => {
      if (settingsRef.current) settingsRef.current.style.opacity = '1'
      if (infoLeftRef.current) infoLeftRef.current.style.opacity = '1'
      if (infoRightRef.current) infoRightRef.current.style.opacity = '1'
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  useEffect(() => {
    return () => {
      clearRunningTimers()
    }
  }, [])

  return (
    <div ref={containerRef} className={styles.gameContainer}>
      <canvas ref={canvasRef} id="game"></canvas>

      <svg ref={windmillRef} width="200" height="250" id="windmill" className={styles.windmill}>
        <defs>
          <path id="arm" d="M -7 -20 C -7 -10 7 -10 7 -20 L 2 -80 L -2 -80" />
        </defs>
        <g transform="translate(100, 100)">
          <g ref={windmillHeadRef} id="windmill-head" className={styles.windmillHead}>
            <circle r="8"></circle>
            <use href="#arm" />
            <use href="#arm" transform="rotate(+120)" />
            <use href="#arm" transform="rotate(-120)" />
          </g>
        </g>
        <path transform="translate(100, 0)" d="M -7 250 L 7 250 L 3 115 L -3 115"></path>
      </svg>

      <div ref={infoLeftRef} id="info-left" className={styles.infoLeft}>
        <h3>
          <span ref={name1Ref} className={styles.name}>
            Player
          </span>
        </h3>
        <p>
          Angle:
          <span ref={angle1Ref} className={styles.angle}>
            0
          </span>
          °
        </p>
        <p>
          Velocity:
          <span ref={velocity1Ref} className={styles.velocity}>
            0
          </span>
        </p>
      </div>

      <div ref={infoRightRef} id="info-right" className={styles.infoRight}>
        <h3>
          <span ref={name2Ref} className={styles.name}>
            Computer
          </span>
        </h3>
        <p>
          Angle:
          <span ref={angle2Ref} className={styles.angle}>
            0
          </span>
          °
        </p>
        <p>
          Velocity:
          <span ref={velocity2Ref} className={styles.velocity}>
            0
          </span>
        </p>
      </div>

      <div ref={instructionsRef} id="instructions" className={styles.instructions}>
        <h3 ref={gameModeRef} id="game-mode">
          Player vs. Computer
        </h3>
        <h2>Drag the bomb to aim!</h2>
      </div>

      <div
        ref={bombGrabAreaRef}
        id="bomb-grab-area"
        className={styles.bombGrabArea}
        onMouseDown={handleMouseDown}
      ></div>

      <div ref={congratulationsRef} id="congratulations" className={styles.congratulations}>
        <h2>
          <span ref={winnerRef} id="winner">
            ?
          </span>
          won!
        </h2>
        <p>
          Say hello{' '}
          <a href="https://t.me/max00764" target="_top" rel="noopener noreferrer">
            @Max00764
          </a>
          .
        </p>
        <div className={styles.dropdown}>
          <button className={styles.dropbtn}>New Game</button>
          <div className={styles.dropdownContent}>
            <a href="" onClick={setSinglePlayer} className={styles.singlePlayer}>
              Single Player
            </a>
            <a href="" onClick={setTwoPlayers} className={styles.twoPlayers}>
              Two-Player
            </a>
            <a href="" onClick={setAutoPlay} className={styles.autoPlay}>
              Autoplay
            </a>
          </div>
        </div>
      </div>

      <div ref={settingsRef} id="settings" className={styles.settings}>
        <div className={styles.dropdown}>
          <button className={styles.windFlag}>
            <svg
              width="20"
              height="20"
              viewBox="0 0 30 30"
              version="1"
              xmlns="http://www.w3.org/2000/svg"
              xmlnsXlink="http://www.w3.org/1999/xlink"
            >
              <title>wind-flag</title>
              <desc>Created with Sketch Beta.</desc>
              <defs></defs>
              <g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                <g id="Icon-Set" transform="translate(-465.000000, -776.000000)" fill="#fff">
                  <path
                    d="M493,786.066 C493,786.877 492.935,787 492,787 L489,787.3 L489,779.7 L492,780 C492.935,780 493,780.123 493,780.934 L493,786.066 L493,786.066 Z M487,787.5 L481,788.1 L481,778.9 L487,779.5 L487,787.5 L487,787.5 Z M479,788.3 L472,789 C471.065,789 471,788.811 471,788 L471,779 C471,778.19 471.065,778 472,778 L479,778.7 L479,788.3 L479,788.3 Z M493,778 L471,776 C469.896,776 469,776.896 469,778 L469,789 C469,790.104 469.896,791 471,791 L493,789 C494.104,789 495,788.104 495,787 L495,780 C495,778.896 494.104,778 493,778 L493,778 Z M466,776 C465.447,776 465,776.448 465,777 L465,805 C465,805.553 465.447,806 466,806 C466.553,806 467,805.553 467,805 L467,777 C467,776.448 466.553,776 466,776 L466,776 Z"
                    id="wind-flag"
                  ></path>
                </g>
              </g>
            </svg>
          </button>
          <div className={styles.dropdownContent}>
            <div ref={windInfoRef} id="wind-info" className={styles.windInfo}>
              Wind Speed:{' '}
              <span ref={windSpeedRef} id="wind-speed">
                0
              </span>
            </div>
          </div>
        </div>
        <div className={styles.dropdown}>
          <button className={styles.dropbtn}>New Game</button>
          <div className={styles.dropdownContent}>
            <a href="" onClick={setSinglePlayer} className={styles.singlePlayer}>
              Single Player
            </a>
            <a href="" onClick={setTwoPlayers} className={styles.twoPlayers}>
              Two-Players
            </a>
            <a href="" onClick={setAutoPlay} className={styles.autoPlay}>
              Autoplay
            </a>
          </div>
        </div>

        <button
          ref={colorModeButtonRef}
          id="color-mode"
          onClick={toggleColorMode}
          className={styles.colorMode}
        >
          {settings.mode === 'dark' ? 'Light Mode' : 'Dark Mode'}
        </button>
      </div>
    </div>
  )
}

export default Gorillas
