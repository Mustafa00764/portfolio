import type { VisualAssetConfig } from './assets'

export type AnimationState =
  | 'idle'
  | 'attack'
  | 'hurt'
  | 'damage60'
  | 'damage30'
  | 'death'

export interface RuntimeAnimationController {
  currentState: AnimationState
  stateStartedAtMs: number
}

export const createAnimationController = (): RuntimeAnimationController => ({
  currentState: 'idle',
  stateStartedAtMs: 0
})

export const setAnimationState = (
  controller: RuntimeAnimationController,
  nextState: AnimationState,
  nowMs: number
) => {
  if (controller.currentState === nextState) return
  controller.currentState = nextState
  controller.stateStartedAtMs = nowMs
}

export const getAnimationClip = (
  visuals: VisualAssetConfig | undefined,
  state: AnimationState
) => {
  if (!visuals) return undefined
  return visuals.states[state] ?? visuals.states.idle
}

export const getAnimationFrameIndex = (
  visuals: VisualAssetConfig | undefined,
  state: AnimationState,
  nowMs: number,
  stateStartedAtMs: number
) => {
  const clip = getAnimationClip(visuals, state)
  if (!clip || clip.frames.length === 0) return 0

  const frameDurationMs = 1000 / Math.max(1, clip.fps)
  const elapsedMs = Math.max(0, nowMs - stateStartedAtMs)
  const rawIndex = Math.floor(elapsedMs / frameDurationMs)

  if (clip.loop) {
    return rawIndex % clip.frames.length
  }

  return Math.min(rawIndex, clip.frames.length - 1)
}

export const isAnimationFinished = (
  visuals: VisualAssetConfig | undefined,
  state: AnimationState,
  nowMs: number,
  stateStartedAtMs: number
) => {
  const clip = getAnimationClip(visuals, state)
  if (!clip) return true
  if (clip.loop) return false

  const durationMs = (clip.frames.length / Math.max(1, clip.fps)) * 1000
  return nowMs - stateStartedAtMs >= durationMs
}