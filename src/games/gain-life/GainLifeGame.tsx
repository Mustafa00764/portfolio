import { useEffect, useMemo, useRef, useState } from 'react'
import styles from './GainLifeGame.module.css'

// Тип одного "сердца" (таргета)
type Heart = {
  id: string
  x: number // 0..100 (%)
  y: number // 0..100 (%)
  size: number // px
  bornAt: number // ms
  ttl: number // ms
  value: number // life за клик
  kind: 'normal' | 'gold' | 'trap'
}

type Highscore = { bestLife: number; bestCombo: number; date: string }

const STORAGE_KEY = 'gain-life-highscore-v1'

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n))
}

function uid() {
  return Math.random().toString(16).slice(2) + Date.now().toString(16)
}

// Генерация сердца: разные типы
function createHeart(level: number): Heart {
  // Чем выше уровень — тем меньше TTL и меньше размер
  const baseTtl = clamp(1400 - level * 70, 550, 1400)
  const baseSize = clamp(64 - level * 2, 34, 64)

  // Шанс на "золотое" (больше life) и "ловушку" (минус life)
  const goldChance = clamp(0.08 + level * 0.01, 0.08, 0.22)
  const trapChance = clamp(0.05 + level * 0.008, 0.05, 0.18)

  const r = Math.random()
  let kind: Heart['kind'] = 'normal'
  if (r < trapChance) kind = 'trap'
  else if (r < trapChance + goldChance) kind = 'gold'

  const size = Math.round(baseSize * (0.85 + Math.random() * 0.35))
  const ttl = Math.round(baseTtl * (0.85 + Math.random() * 0.35))

  const value = kind === 'gold' ? 3 : kind === 'trap' ? -2 : 1

  // Чтобы не спавнилось у самых краёв (сложнее кликать на мобильном)
  const pad = 8
  const x = pad + Math.random() * (100 - pad * 2)
  const y = pad + Math.random() * (100 - pad * 2)

  return {
    id: uid(),
    x,
    y,
    size,
    bornAt: performance.now(),
    ttl,
    value,
    kind
  }
}

function loadHighscore(): Highscore {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { bestLife: 0, bestCombo: 0, date: '' }
    const parsed = JSON.parse(raw) as Highscore
    return {
      bestLife: Number(parsed.bestLife || 0),
      bestCombo: Number(parsed.bestCombo || 0),
      date: String(parsed.date || '')
    }
  } catch {
    return { bestLife: 0, bestCombo: 0, date: '' }
  }
}

function saveHighscore(next: Highscore) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  } catch (error) {
    console.log(error)
  }
}

export function GainLifeGame() {
  // Настройки матча
  const ROUND_SECONDS = 30

  // Состояния игры
  const [phase, setPhase] = useState<'idle' | 'playing' | 'ended'>('idle')
  const [timeLeft, setTimeLeft] = useState<number>(ROUND_SECONDS)

  const [life, setLife] = useState<number>(0)
  const [combo, setCombo] = useState<number>(0)
  const [bestCombo, setBestCombo] = useState<number>(0)

  const [misses, setMisses] = useState<number>(0)
  const [level, setLevel] = useState<number>(1)

  const [hearts, setHearts] = useState<Heart[]>([])
  const [floatingText, setFloatingText] = useState<
    { id: string; x: number; y: number; text: string; kind: 'good' | 'bad' }[]
  >([])

  const [highscore, setHighscore] = useState<Highscore>(() =>
    typeof window !== 'undefined' ? loadHighscore() : { bestLife: 0, bestCombo: 0, date: '' }
  )

  // refs, чтобы интервалы не зависели от стейта
  const tickerRef = useRef<number | null>(null)
  const spawnerRef = useRef<number | null>(null)

  const arenaRef = useRef<HTMLDivElement | null>(null)

  const heartsPerSecond = useMemo(() => {
    // Уровень повышается от life: каждые 12 life +1 уровень
    // Спавн ускоряется с уровнем
    const base = 1.4
    return clamp(base + level * 0.18, 1.4, 4.2)
  }, [level])

  const maxHeartsOnScreen = useMemo(() => {
    return clamp(5 + Math.floor(level * 0.7), 5, 12)
  }, [level])

  // Обновление уровня от набранной жизни
  useEffect(() => {
    const nextLevel = 1 + Math.floor(life / 12)
    if (nextLevel !== level) setLevel(nextLevel)
  }, [life]) // eslint-disable-line react-hooks/exhaustive-deps

  // Очистка интервалов
  function clearLoops() {
    if (tickerRef.current) window.clearInterval(tickerRef.current)
    if (spawnerRef.current) window.clearInterval(spawnerRef.current)
    tickerRef.current = null
    spawnerRef.current = null
  }

  // Старт игры
  function start() {
    clearLoops()
    setPhase('playing')
    setTimeLeft(ROUND_SECONDS)
    setLife(0)
    setCombo(0)
    setBestCombo(0)
    setMisses(0)
    setLevel(1)
    setHearts([])
    setFloatingText([])

    // Таймер секунды
    tickerRef.current = window.setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) return 0
        return t - 1
      })
    }, 1000)

    // Спавнер (частота зависит от уровня)
    spawnerRef.current = window.setInterval(
      () => {
        setHearts(prev => {
          if (prev.length >= maxHeartsOnScreen) return prev
          return [...prev, createHeart(level)]
        })
      },
      Math.round(1000 / heartsPerSecond)
    )
  }

  // Конец игры
  function end() {
    clearLoops()
    setPhase('ended')
    setHearts([])
  }

  // завершить досрочно
  function finishEarly() {
    if (phase !== 'playing') return
    end() // использует уже существующую логику остановки
  }

  // Следим за таймером
  useEffect(() => {
    if (phase === 'playing' && timeLeft <= 0) end()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft, phase])

  // Важно: когда level меняется — обновить частоту спавна
  useEffect(() => {
    if (phase !== 'playing') return
    if (spawnerRef.current) window.clearInterval(spawnerRef.current)
    spawnerRef.current = window.setInterval(
      () => {
        setHearts(prev => {
          if (prev.length >= maxHeartsOnScreen) return prev
          return [...prev, createHeart(level)]
        })
      },
      Math.round(1000 / heartsPerSecond)
    )

    return () => {
      if (spawnerRef.current) window.clearInterval(spawnerRef.current)
    }
  }, [phase, level, heartsPerSecond, maxHeartsOnScreen])

  // Удаление "просроченных" сердец (TTL)
  useEffect(() => {
    if (phase !== 'playing') return

    const raf = window.setInterval(() => {
      const now = performance.now()
      setHearts(prev => {
        const alive = prev.filter(h => now - h.bornAt < h.ttl)
        const removed = prev.length - alive.length

        if (removed > 0) {
          // Если сердце исчезло само — это промах и сброс комбо
          setMisses(m => m + removed)
          setCombo(0)
        }
        return alive
      })
    }, 80)

    return () => window.clearInterval(raf)
  }, [phase])

  // Клик по сердцу
  function hit(heart: Heart) {
    // Удаляем сердце
    setHearts(prev => prev.filter(h => h.id !== heart.id))

    // Обновляем life
    setLife(v => Math.max(0, v + heart.value))

    // Комбо: ловушка сбрасывает и даёт минус
    if (heart.kind === 'trap') {
      setCombo(0)
    } else {
      setCombo(c => {
        const next = c + 1
        setBestCombo(b => Math.max(b, next))
        return next
      })
    }

    // Всплывающий текст
    const arena = arenaRef.current
    if (arena) {
      setFloatingText(prev => [
        ...prev,
        {
          id: uid(),
          x: heart.x,
          y: heart.y,
          text: heart.value > 0 ? `+${heart.value}` : `${heart.value}`,
          kind: heart.value > 0 ? 'good' : 'bad'
        }
      ])
    }
  }

  // Удаляем всплывающий текст
  useEffect(() => {
    if (floatingText.length === 0) return
    const id = window.setTimeout(() => {
      setFloatingText(prev => prev.slice(1))
    }, 450)
    return () => window.clearTimeout(id)
  }, [floatingText])

  // Промах по арене (клик мимо)
  function miss() {
    if (phase !== 'playing') return
    setMisses(m => m + 1)
    setCombo(0)
  }

  // После игры сохраняем рекорды
  useEffect(() => {
    if (phase !== 'ended') return

    const next: Highscore = {
      bestLife: Math.max(highscore.bestLife, life),
      bestCombo: Math.max(highscore.bestCombo, bestCombo),
      date: new Date().toLocaleString()
    }
    setHighscore(next)
    saveHighscore(next)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase])

  // Если компонент размонтируется — чистим интервалы
  useEffect(() => {
    return () => clearLoops()
  }, [])
  // eslint-disable-next- line react-hooks/exhaustive-deps

  return (
    <div className={styles.root}>
      <header className={styles.header}>
        <div className={styles.brand}>
          {/* Подставь свой путь к лого */}
          <img
            className={styles.logo}
            src={'/images/gain-life.png'}
            alt="Gain Life"
            draggable={false}
          />
          <div className={styles.titles}>
            <div className={styles.title}>GAIN LIFE</div>
            <div className={styles.subtitle}>click the hearts</div>
          </div>
        </div>

        <div className={styles.stats}>
          <div className={styles.stat}>
            <span className={styles.k}>Time</span>
            <span className={styles.v}>{timeLeft}s</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.k}>Life</span>
            <span className={styles.v}>{life}</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.k}>Combo</span>
            <span className={styles.v}>{combo}</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.k}>Lvl</span>
            <span className={styles.v}>{level}</span>
          </div>
        </div>
      </header>

      <main className={styles.main}>
        <div
          ref={arenaRef}
          className={styles.arena}
          onMouseDown={miss}
          onTouchStart={miss}
          role="button"
          aria-label="Game arena"
        >
          {phase === 'playing' && (
            <button className={styles.dangerBtn} onClick={finishEarly}>
              End game
            </button>
          )}
          {/* Сердца */}
          {hearts.map(h => (
            <button
              key={h.id}
              className={`${styles.heart} ${styles[h.kind]}`}
              style={{
                left: `${h.x}%`,
                top: `${h.y}%`,
                width: `${h.size}px`,
                height: `${h.size}px`
              }}
              onMouseDown={e => {
                e.stopPropagation()
                hit(h)
              }}
              onTouchStart={e => {
                e.stopPropagation()
                hit(h)
              }}
              aria-label="heart"
            />
          ))}

          {/* Всплывающие числа */}
          {floatingText.map(num => (
            <div
              key={num.id}
              className={`${styles.float} ${num.kind === 'good' ? styles.good : styles.bad}`}
              style={{ left: `${num.x}%`, top: `${num.y}%` }}
            >
              {num.text}
            </div>
          ))}

          {/* Оверлеи */}
          {phase !== 'playing' && (
            <div className={styles.overlay}>
              {phase === 'idle' && (
                <>
                  <div className={styles.overlayTitle}>Ready?</div>
                  <div className={styles.overlayText}>
                    Click on the hearts. Gold ones give more Life, red traps take away more.
                  </div>
                  <button className={styles.primaryBtn} onClick={start}>
                    Start
                  </button>
                  <div className={styles.hint}>
                    The best result: <b>{highscore.bestLife}</b> Life • The best combo:{' '}
                    <b>{highscore.bestCombo}</b>
                  </div>
                </>
              )}

              {phase === 'ended' && (
                <>
                  <div className={styles.overlayTitle}>Game Over</div>
                  <div className={styles.overlayText}>
                    Life: <b>{life}</b> • Best combo: <b>{bestCombo}</b> • Misses: <b>{misses}</b>
                  </div>

                  <div className={styles.hint}>
                    Rekord: <b>{highscore.bestLife}</b> Life • Combo record:{' '}
                    <b>{highscore.bestCombo}</b>
                  </div>

                  <div className={styles.rowBtns}>
                    <button className={styles.primaryBtn} onClick={start}>
                      Play again
                    </button>
                    <button
                      className={styles.secondaryBtn}
                      onClick={() => {
                        const reset: Highscore = { bestLife: 0, bestCombo: 0, date: '' }
                        setHighscore(reset)
                        saveHighscore(reset)
                      }}
                    >
                      Reset record
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* <aside className={styles.side}>
          <div className={styles.panel}>
            <div className={styles.panelTitle}>Rules</div>
            <ul className={styles.list}>
              <li>❤️ Normal: +1 Life</li>
              <li>✨ Gold: +3 Life</li>
              <li>☠ Trap: -2 Life + сброс комбо</li>
              <li>Промах/исчезновение сердца: +miss и сброс комбо</li>
            </ul>
          </div>

          <div className={styles.panel}>
            <div className={styles.panelTitle}>Tip</div>
            <div className={styles.panelText}>
              Если используешь flex-layout, и Swiper/контент “не сжимается” — часто помогает{' '}
              <code>min-width: 0</code> на среднем блоке 😉
            </div>
          </div>
        </aside> */}
      </main>
    </div>
  )
}
