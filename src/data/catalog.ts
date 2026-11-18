export type CategorySlug = 'puzzle' | 'arcade' | 'casual' | 'reflex'

export type GameArtKind = '2048' | 'snake'

export interface Category {
  slug: CategorySlug
  name: string
  blurb: string
  icon: 'brain' | 'joystick' | 'spark' | 'bolt'
  tone: 'indigo' | 'orange' | 'green' | 'pink'
}

export interface RatingBreakdown {
  stars: 5 | 4 | 3 | 2 | 1
  percent: number
}

export interface Game {
  id: string
  name: string
  englishName: string
  tagline: string
  developer: string
  categories: CategorySlug[]
  tags: string[]
  rating: number
  ratingCount: number
  ageRating: string
  size: string
  version: string
  updated: string
  released: string
  languages: string
  compatibility: string
  art: GameArtKind
  accent: {
    solid: string
    soft: string
    gradientFrom: string
    gradientTo: string
  }
  description: string[]
  features: string[]
  controls: string[]
  ratings: RatingBreakdown[]
}

export const CATEGORIES: Category[] = [
  {
    slug: 'puzzle',
    name: '益智',
    blurb: '慢慢想，刚刚好',
    icon: 'brain',
    tone: 'indigo',
  },
  {
    slug: 'arcade',
    name: '街机',
    blurb: '再来一局的爽快',
    icon: 'joystick',
    tone: 'orange',
  },
  {
    slug: 'casual',
    name: '休闲',
    blurb: '随时开一局',
    icon: 'spark',
    tone: 'green',
  },
  {
    slug: 'reflex',
    name: '反应',
    blurb: '手速与判断力',
    icon: 'bolt',
    tone: 'pink',
  },
]

export const GAMES: Game[] = [
  {
    id: '2048',
    name: '2048',
    englishName: '2048',
    tagline: '轻推数字，合并出你的 2048',
    developer: '小玩工作室',
    categories: ['puzzle', 'casual'],
    tags: ['数字', '合并', '单机', '随时玩'],
    rating: 4.8,
    ratingCount: 328,
    ageRating: '4+',
    size: '2.1 MB',
    version: '1.2.0',
    updated: '2026年11月18日',
    released: '2026年11月18日',
    languages: '简体中文',
    compatibility: 'Safari、Chrome、Edge 等现代浏览器',
    art: '2048',
    accent: {
      solid: '#0f766e',
      soft: '#e6f4f1',
      gradientFrom: '#0b3d3a',
      gradientTo: '#0f9b8e',
    },
    description: [
      '2048 是一款关于「合并」的数字游戏。滑动棋盘，让相同数字相遇、翻倍，从 2 一路走到 2048。规则一眼就能看懂，但每一步都值得想一想。',
      '没有计时器，也没有倒计时压力。你可以在通勤路上玩两分钟，也可以安静地挑战一整个下午。每一次失误都可以撤销一步，最高分会自动留在设备上。',
      '这一版为浏览器重新绘制了整套棋盘和配色，支持键盘、鼠标和触屏滑动。希望你会在某个数字最后一次合并时，轻轻「啊」一声。',
    ],
    features: [
      '经典 4×4 棋盘，滑动或方向键都能操作',
      '一次撤销，手滑也不必从头再来',
      '最高分自动保存，随时挑战自己',
      '支持键盘、触屏滑动与鼠标操作',
    ],
    controls: ['方向键 / WASD 滑动棋盘', '在手机上向任意方向滑动', '点击「撤销」退回上一步'],
    ratings: [
      { stars: 5, percent: 76 },
      { stars: 4, percent: 16 },
      { stars: 3, percent: 5 },
      { stars: 2, percent: 2 },
      { stars: 1, percent: 1 },
    ],
  },
  {
    id: 'snake',
    name: '霓虹贪吃蛇',
    englishName: 'Neon Snake',
    tagline: '在霓虹网格里，吃豆变长',
    developer: '小玩工作室',
    categories: ['arcade', 'reflex', 'casual'],
    tags: ['街机', '反应', '经典重制', '单机'],
    rating: 4.7,
    ratingCount: 256,
    ageRating: '4+',
    size: '1.8 MB',
    version: '1.0.3',
    updated: '2026年11月18日',
    released: '2026年11月18日',
    languages: '简体中文',
    compatibility: 'Safari、Chrome、Edge 等现代浏览器',
    art: 'snake',
    accent: {
      solid: '#0e9f6e',
      soft: '#e7f8f0',
      gradientFrom: '#0b1220',
      gradientTo: '#123c36',
    },
    description: [
      '贪吃蛇回来了，这一次它住在霓虹网格里。控制小蛇吃掉发光果实，身体会越来越长，速度也会一点点变快。',
      '撞到墙或自己的身体，这一局就结束了。听起来简单，但当蛇身绕成一个小圈，你会发现自己开始屏住呼吸。',
      '支持键盘、屏幕方向键和滑动操作，暂停后可以慢慢想。最高分会保存在设备上，下一次打开就能接着挑战。',
    ],
    features: [
      '经典 20×20 网格，吃得越多速度越快',
      '键盘、滑动和屏幕方向键三种操作',
      '空格键随时暂停，最高分自动保存',
      '为窄屏手机适配的单手方向键',
    ],
    controls: ['方向键 / WASD 控制方向', '空格键暂停或继续', '手机可使用屏幕方向键或滑动'],
    ratings: [
      { stars: 5, percent: 71 },
      { stars: 4, percent: 19 },
      { stars: 3, percent: 6 },
      { stars: 2, percent: 2 },
      { stars: 1, percent: 2 },
    ],
  },
]

export const FEATURED_GAME_ID = '2048'

export const GAME_MAP: Record<string, Game> = Object.fromEntries(
  GAMES.map((game) => [game.id, game]),
)

export function getGame(id: string): Game | undefined {
  return GAME_MAP[id]
}

export function getCategory(slug: string): Category | undefined {
  return CATEGORIES.find((category) => category.slug === slug)
}

export function gamesInCategory(slug: CategorySlug): Game[] {
  return GAMES.filter((game) => game.categories.includes(slug))
}

export function gamesMatching(query: string): Game[] {
  const needle = query.trim().toLowerCase()
  if (!needle) return []
  return GAMES.filter((game) =>
    [
      game.name,
      game.englishName,
      game.tagline,
      game.developer,
      ...game.tags,
      ...game.categories.map((slug) => getCategory(slug)?.name ?? ''),
    ]
      .join(' ')
      .toLowerCase()
      .includes(needle),
  )
}

export const POPULAR_SEARCHES = ['2048', '贪吃蛇', '益智', '街机', '单机']
