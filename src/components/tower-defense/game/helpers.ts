import type { ThemeAssetsConfig, VisualAssetConfig } from './assets'

export interface LoadedImageMap {
  [src: string]: HTMLImageElement | null
}

export const collectAllAssetPaths = (
  themeAssets: ThemeAssetsConfig,
  defenderVisuals: Record<string, VisualAssetConfig>,
  enemyVisuals: Record<string, VisualAssetConfig>
): string[] => {
  const result = new Set<string>()

  if (themeAssets.boardBackground) result.add(themeAssets.boardBackground)
  if (themeAssets.topBarBackground) result.add(themeAssets.topBarBackground)
  if (themeAssets.leftLaneStrip) result.add(themeAssets.leftLaneStrip)
  if (themeAssets.rightLaneStrip) result.add(themeAssets.rightLaneStrip)

  themeAssets.grassTiles.forEach(src => {
    if (src) result.add(src)
  })

  const collectVisualMap = (map: Record<string, VisualAssetConfig>) => {
    Object.values(map).forEach(visual => {
      Object.values(visual.states).forEach(clip => {
        if (!clip) return

        clip.frames.forEach(src => {
          if (src) result.add(src)
        })
      })
    })
  }

  collectVisualMap(defenderVisuals)
  collectVisualMap(enemyVisuals)

  return Array.from(result)
}

export const loadImageSafe = (src?: string): Promise<HTMLImageElement | null> => {
  return new Promise(resolve => {
    if (!src) {
      resolve(null)
      return
    }

    const img = new Image()

    img.onload = () => resolve(img)

    img.onerror = () => {
      console.warn(`Не удалось загрузить изображение: ${src}`)
      resolve(null)
    }

    img.src = src
  })
}

export const loadImagesMap = async (paths: string[]): Promise<LoadedImageMap> => {
  const uniquePaths = Array.from(new Set(paths))

  const entries = await Promise.all(
    uniquePaths.map(async src => {
      const img = await loadImageSafe(src)
      return [src, img] as const
    })
  )

  return Object.fromEntries(entries)
}

export const collision = (first: any, second: any) => {
  return !(
    first.x > second.x + second.width ||
    first.x + first.width < second.x ||
    first.y > second.y + second.height ||
    first.y + first.height < second.y
  )
}