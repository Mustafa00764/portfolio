import type { AnimationState } from './animation'

export interface AnimationClipConfig {
  frames: string[]
  fps: number
  loop: boolean
}

export interface VisualAssetConfig {
  widthScale?: number
  heightScale?: number
  anchorX?: number
  anchorY?: number
  states: Partial<Record<AnimationState, AnimationClipConfig>>
}

export interface ThemeAssetsConfig {
  boardBackground?: string
  topBarBackground?: string
  leftLaneStrip?: string
  rightLaneStrip?: string
  grassTiles: string[]
}

const getFrames = (
  kind: string,
  link: string,
  type: string,
  int: number,
  frames: number
): string[] => {
  let framesArr: string[] = []
  const url: string = `/assets/${kind}/${link}/${type}/${type}_`

  for (let i = 1; i <= frames; i++) {
    let count = '0'.repeat(int.toString().length - i.toString().length)
    framesArr.push(url + `${count}${i}.png`)
  }

  return framesArr
}

export const THEME_ASSETS: ThemeAssetsConfig = {
  boardBackground: '/assets/theme/board-background.png',
  topBarBackground: '/assets/theme/topbar-background.png',
  leftLaneStrip: '/assets/theme/left-lane-strip.png',
  rightLaneStrip: '/assets/theme/right-lane-strip.png',
  grassTiles: ['/assets/theme/grass-1.png', '/assets/theme/grass-2.png']
}

export const DEFENDER_VISUALS: Record<string, VisualAssetConfig> = {
  sunflower: {
    widthScale: 1,
    heightScale: 1,
    anchorX: 0,
    anchorY: 0,
    states: {
      idle: {
        fps: 40,
        loop: true,
        frames: getFrames('plants', 'sunflower', 'idle', 60, 60)
      },
      attack: {
        fps: 0,
        loop: false,
        frames: []
      },
      hurt: {
        fps: 40,
        loop: false,
        frames: getFrames('plants', 'sunflower', 'idle', 60, 60)
      },
      damage60: {
        fps: 40,
        loop: true,
        frames: getFrames('plants', 'sunflower', 'idle', 60, 60)
      },
      damage30: {
        fps: 40,
        loop: true,
        frames: getFrames('plants', 'sunflower', 'idle', 60, 60)
      },
      death: {
        fps: 40,
        loop: false,
        frames: getFrames('plants', 'sunflower', 'idle', 60, 40)
      }
    }
  },

  pea: {
    widthScale: 1.2,
    heightScale: 1.2,
    anchorX: 10,
    anchorY: 10,
    states: {
      idle: {
        fps: 30,
        loop: true,
        frames: getFrames('plants', 'pea', 'idle', 31, 31)
      },
      attack: {
        fps: 30,
        loop: false,
        frames: getFrames('plants', 'pea', 'attack', 31, 31)
      },
      hurt: {
        fps: 30,
        loop: false,
        frames: getFrames('plants', 'pea', 'idle', 31, 31)
      },
      damage60: {
        fps: 30,
        loop: true,
        frames: getFrames('plants', 'pea', 'idle', 31, 31)
      },
      damage30: {
        fps: 30,
        loop: true,
        frames: getFrames('plants', 'pea', 'idle', 31, 31)
      },
      death: {
        fps: 30,
        loop: false,
        frames: getFrames('plants', 'pea', 'idle', 31, 31)
      }
    }
  },

  tank: {
    widthScale: 0.8,
    heightScale: 1,
    anchorX: -9,
    anchorY: 0,
    states: {
      idle: {
        fps: 90,
        loop: true,
        frames: getFrames('plants', 'tank', 'idle', 270, 270)
      },
      hurt: {
        fps: 90,
        loop: true,
        frames: getFrames('plants', 'tank', 'idle', 270, 270)
      },
      damage60: {
        fps: 33,
        loop: true,
        frames: getFrames('plants', 'tank', 'damage60', 100, 100)
      },
      damage30: {
        fps: 66,
        loop: true,
        frames: getFrames('plants', 'tank', 'damage30', 200, 200)
      },
      death: {
        fps: 40,
        loop: false,
        frames: getFrames('plants', 'tank', 'damage30', 200, 40)
      }
    }
  },

  sniper: {
    widthScale: 1.6,
    heightScale: 1.6,
    anchorX: 35,
    anchorY: 20,
    states: {
      idle: {
        fps: 30,
        loop: true,
        frames: getFrames('plants', 'sniper', 'idle', 60, 60)
      },
      attack: {
        fps: 36,
        loop: false,
        frames: getFrames('plants', 'sniper', 'attack', 75, 75)
      },
      hurt: {
        fps: 30,
        loop: false,
        frames: getFrames('plants', 'sniper', 'idle', 60, 60)
      },
      damage60: {
        fps: 30,
        loop: true,
        frames: getFrames('plants', 'sniper', 'idle', 60, 60)
      },
      damage30: {
        fps: 30,
        loop: true,
        frames: getFrames('plants', 'sniper', 'idle', 60, 60)
      },
      death: {
        fps: 20,
        loop: false,
        frames: getFrames('plants', 'sniper', 'idle', 60, 20)
      }
    }
  },

  rapid: {
    widthScale: 1.2,
    heightScale: 1.2,
    anchorX: 20,
    anchorY: 2,
    states: {
      idle: {
        fps: 30,
        loop: true,
        frames: getFrames('plants', 'rapid', 'idle', 60, 60)
      },
      attack: {
        fps: 24,
        loop: false,
        frames: getFrames('plants', 'rapid', 'attack', 16, 16)
      },
      hurt: {
        fps: 24,
        loop: false,
        frames: getFrames('plants', 'rapid', 'attack', 16, 16)
      },
      damage60: {
        fps: 30,
        loop: true,
        frames: getFrames('plants', 'rapid', 'idle', 60, 60)
      },
      damage30: {
        fps: 30,
        loop: true,
        frames: getFrames('plants', 'rapid', 'idle', 60, 60)
      },
      death: {
        fps: 20,
        loop: false,
        frames: getFrames('plants', 'rapid', 'idle', 60, 20)
      }
    }
  },

  frost: {
    widthScale: 3,
    heightScale: 3,
    anchorX: 85,
    anchorY: 55,
    states: {
      idle: {
        fps: 25,
        loop: true,
        frames: getFrames('plants', 'frost', 'idle', 50, 50)
      },
      attack: {
        fps: 30,
        loop: false,
        frames: getFrames('plants', 'frost', 'attack', 60, 60)
      },
      hurt: {
        fps: 25,
        loop: false,
        frames: getFrames('plants', 'frost', 'idle', 50, 50)
      },
      damage60: {
        fps: 25,
        loop: true,
        frames: getFrames('plants', 'frost', 'idle', 50, 50)
      },
      damage30: {
        fps: 25,
        loop: true,
        frames: getFrames('plants', 'frost', 'idle', 50, 50)
      },
      death: {
        fps: 25,
        loop: false,
        frames: getFrames('plants', 'frost', 'idle', 50, 25)
      }
    }
  },

  healer: {
    widthScale: 1.2,
    heightScale: 1.2,
    anchorX: 10,
    anchorY: 0,
    states: {
      idle: {
        fps: 30,
        loop: true,
        frames: getFrames('plants', 'healer', 'idle', 50, 50)
      },
      attack: {
        fps: 30,
        loop: true,
        frames: getFrames('plants', 'healer', 'idle', 50, 50)
      },
      hurt: {
        fps: 30,
        loop: false,
        frames: getFrames('plants', 'healer', 'idle', 50, 50)
      },
      damage60: {
        fps: 30,
        loop: true,
        frames: getFrames('plants', 'healer', 'idle', 50, 50)
      },
      damage30: {
        fps: 30,
        loop: true,
        frames: getFrames('plants', 'healer', 'idle', 50, 50)
      },
      death: {
        fps: 20,
        loop: false,
        frames: getFrames('plants', 'healer', 'idle', 50, 20)
      }
    }
  },

  fan: {
    widthScale: 1.2,
    heightScale: 1.2,
    anchorX: 10,
    anchorY: 0,
    states: {
      idle: {
        fps: 33,
        loop: true,
        frames: getFrames('plants', 'fan', 'idle', 100, 100)
      },
      attack: {
        fps: 30,
        loop: false,
        frames: getFrames('plants', 'fan', 'attack', 70, 70)
      },
      hurt: {
        fps: 33,
        loop: false,
        frames: getFrames('plants', 'fan', 'idle', 100, 100)
      },
      damage60: {
        fps: 33,
        loop: true,
        frames: getFrames('plants', 'fan', 'idle', 100, 100)
      },
      damage30: {
        fps: 33,
        loop: true,
        frames: getFrames('plants', 'fan', 'idle', 100, 100)
      },
      death: {
        fps: 20,
        loop: false,
        frames: getFrames('plants', 'fan', 'idle', 100, 20)
      }
    }
  }
}

export const ENEMY_VISUALS: Record<string, VisualAssetConfig> = {
  walker: {
    widthScale: 1.2,
    heightScale: 1.2,
    anchorX: 10,
    anchorY: 5,
    states: {
      idle: {
        fps: 45,
        loop: true,
        frames: getFrames('zombie', 'walker', 'idle', 90, 90)
      },
      attack: {
        fps: 60,
        loop: false,
        frames: getFrames('zombie', 'walker', 'attack', 259, 259)
      },
      hurt: {
        fps: 45,
        loop: false,
        frames: getFrames('zombie', 'walker', 'idle', 90, 90)
      },
      damage60: {
        fps: 45,
        loop: true,
        frames: getFrames('zombie', 'walker', 'idle', 90, 90)
      },
      damage30: {
        fps: 45,
        loop: true,
        frames: getFrames('zombie', 'walker', 'idle', 90, 90)
      },
      death: {
        fps: 25,
        loop: false,
        frames: getFrames('zombie', 'walker', 'death', 55, 55)
      }
    }
  },

  runner: {
    widthScale: 1.7,
    heightScale: 1.3,
    anchorX: 20,
    anchorY: 0.5,
    states: {
      idle: {
        fps: 20,
        loop: true,
        frames: getFrames('zombie', 'runner', 'idle', 20, 20)
      },
      attack: {
        fps: 60,
        loop: false,
        frames: getFrames('zombie', 'runner', 'attack', 259, 259)
      },
      hurt: {
        fps: 20,
        loop: false,
        frames: getFrames('zombie', 'runner', 'idle', 20, 20)
      },
      damage60: {
        fps: 20,
        loop: true,
        frames: getFrames('zombie', 'runner', 'idle', 20, 20)
      },
      damage30: {
        fps: 20,
        loop: true,
        frames: getFrames('zombie', 'runner', 'idle', 20, 20)
      },
      death: {
        fps: 25,
        loop: false,
        frames: getFrames('zombie', 'runner', 'death', 55, 55)
      }
    }
  },

  ghoul: {
    widthScale: 2.5,
    heightScale: 1.8,
    anchorX: 20,
    anchorY: 35,
    states: {
      idle: {
        fps: 30,
        loop: true,
        frames: getFrames('zombie', 'ghoul', 'idle', 90, 90)
      },
      attack: {
        fps: 60,
        loop: false,
        frames: getFrames('zombie', 'ghoul', 'attack', 280, 280)
      },
      hurt: {
        fps: 30,
        loop: false,
        frames: getFrames('zombie', 'ghoul', 'idle', 90, 90)
      },
      damage60: {
        fps: 30,
        loop: true,
        frames: getFrames('zombie', 'ghoul', 'idle', 90, 90)
      },
      damage30: {
        fps: 30,
        loop: true,
        frames: getFrames('zombie', 'ghoul', 'idle', 90, 90)
      },
      death: {
        fps: 30,
        loop: false,
        frames: getFrames('zombie', 'ghoul', 'death', 60, 60)
      }
    }
  },

  brute: {
    widthScale: 1.8,
    heightScale: 1.8,
    anchorX: 10,
    anchorY: 0,
    states: {
      idle: {
        fps: 40,
        loop: true,
        frames: getFrames('zombie', 'brute', 'idle', 121, 121)
      },
      attack: {
        fps: 60,
        loop: false,
        frames: getFrames('zombie', 'brute', 'attack', 254, 254)
      },
      hurt: {
        fps: 40,
        loop: false,
        frames: getFrames('zombie', 'brute', 'idle', 121, 121)
      },
      damage60: {
        fps: 40,
        loop: true,
        frames: getFrames('zombie', 'brute', 'idle', 121, 121)
      },
      damage30: {
        fps: 40,
        loop: true,
        frames: getFrames('zombie', 'brute', 'idle', 121, 121)
      },
      death: {
        fps: 40,
        loop: false,
        frames: getFrames('zombie', 'brute', 'death', 105, 105)
      }
    }
  },

  elite: {
    widthScale: 1.8,
    heightScale: 1.8,
    anchorX: 10,
    anchorY: 0,
    states: {
      idle: {
        fps: 40,
        loop: true,
        frames: getFrames('zombie', 'elite', 'idle', 111, 111)
      },
      attack: {
        fps: 60,
        loop: false,
        frames: getFrames('zombie', 'elite', 'attack', 254, 254)
      },
      hurt: {
        fps: 40,
        loop: false,
        frames: getFrames('zombie', 'elite', 'idle', 111, 111)
      },
      damage60: {
        fps: 40,
        loop: true,
        frames: getFrames('zombie', 'elite', 'idle', 111, 111)
      },
      damage30: {
        fps: 40,
        loop: true,
        frames: getFrames('zombie', 'elite', 'idle', 111, 111)
      },
      death: {
        fps: 40,
        loop: false,
        frames: getFrames('zombie', 'elite', 'death', 105, 105)
      }
    }
  },

  arsonist: {
    widthScale: 3.3,
    heightScale: 2.4,
    anchorX: 10,
    anchorY: 25,
    states: {
      idle: {
        fps: 25,
        loop: true,
        frames: getFrames('zombie', 'arsonist', 'idle', 60, 60)
      },
      attack: {
        fps: 60,
        loop: false,
        frames: getFrames('zombie', 'arsonist', 'attack', 190, 190)
      },
      hurt: {
        fps: 25,
        loop: false,
        frames: getFrames('zombie', 'arsonist', 'idle', 60, 60)
      },
      damage60: {
        fps: 25,
        loop: true,
        frames: getFrames('zombie', 'arsonist', 'idle', 60, 60)
      },
      damage30: {
        fps: 25,
        loop: true,
        frames: getFrames('zombie', 'arsonist', 'idle', 60, 60)
      },
      death: {
        fps: 60,
        loop: false,
        frames: getFrames('zombie', 'arsonist', 'death', 112, 112)
      }
    }
  },

  ranged: {
    widthScale: 1.55,
    heightScale: 1.55,
    anchorX: 30,
    anchorY: 10,
    states: {
      idle: {
        fps: 30,
        loop: true,
        frames: getFrames('zombie', 'ranged', 'idle', 90, 90)
      },
      attack: {
        fps: 60,
        loop: false,
        frames: getFrames('zombie', 'ranged', 'attack', 259, 259)
      },
      hurt: {
        fps: 30,
        loop: false,
        frames: getFrames('zombie', 'ranged', 'idle', 90, 90)
      },
      damage60: {
        fps: 30,
        loop: true,
        frames: getFrames('zombie', 'ranged', 'idle', 90, 90)
      },
      damage30: {
        fps: 30,
        loop: true,
        frames: getFrames('zombie', 'ranged', 'idle', 90, 90)
      },
      death: {
        fps: 30,
        loop: false,
        frames: getFrames('zombie', 'ranged', 'death', 55, 55)
      }
    }
  },

  boss: {
    widthScale: 6,
    heightScale: 4,
    anchorX: 120,
    anchorY: 40,
    states: {
      idle: {
        fps: 30,
        loop: true,
        frames: getFrames('zombie', 'boss', 'idle', 71, 71)
      },
      attack: {
        fps: 30,
        loop: false,
        frames: getFrames('zombie', 'boss', 'attack', 91, 91)
      },
      hurt: {
        fps: 30,
        loop: false,
        frames: getFrames('zombie', 'boss', 'idle', 71, 71)
      },
      damage60: {
        fps: 30,
        loop: true,
        frames: getFrames('zombie', 'boss', 'idle', 71, 71)
      },
      damage30: {
        fps: 30,
        loop: true,
        frames: getFrames('zombie', 'boss', 'idle', 71, 71)
      },
      death: {
        fps: 30,
        loop: false,
        frames: getFrames('zombie', 'boss', 'death', 79, 79)
      }
    }
  }
}
