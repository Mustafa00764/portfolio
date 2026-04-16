import { useRef, useCallback } from 'react'
import { Howl } from 'howler'

export const useSounds = () => {
  const bgMusicRef = useRef<Howl | null>(null)
  const jumpSoundRef = useRef<Howl | null>(null)
  const deathSoundRef = useRef<Howl | null>(null)

  const initSounds = useCallback(() => {
    bgMusicRef.current = new Howl({
      src: ['/assets/stereo_madness.mp3'],
      loop: true,
      volume: 0.5
    })
    jumpSoundRef.current = new Howl({
      src: ['/assets/jump.wav'],
      volume: 0.3
    })
    deathSoundRef.current = new Howl({
      src: ['/assets/death.wav'],
      volume: 0.4
    })
  }, [])

  const playJump = useCallback(() => jumpSoundRef.current?.play(), [])
  const playDeath = useCallback(() => deathSoundRef.current?.play(), [])
  const startMusic = useCallback(() => bgMusicRef.current?.play(), [])
  const stopMusic = useCallback(() => bgMusicRef.current?.stop(), [])

  return { initSounds, playJump, playDeath, startMusic, stopMusic }
}
