import type { CSSProperties } from 'react'
import type { Game } from '../data/catalog'

const TILE_VALUES = [2, 4, 8, 16, 32, 64, 128, 256, 512, 1024, 2048]

function tileTone(value: number): string {
  return TILE_VALUES.includes(value) ? String(value) : 'super'
}

export function GameIcon({
  game,
  size = 64,
  className = '',
}: {
  game: Game
  size?: number
  className?: string
}) {
  return (
    <span
      className={`game-icon game-icon--${game.art} ${className}`.trim()}
      style={{ '--icon-size': `${size}px` } as CSSProperties}
      aria-hidden
    >
      {game.art === '2048' ? (
        <span className="game-icon__tiles">
          <span data-value="2">2</span>
          <span data-value="0">0</span>
          <span data-value="4">4</span>
          <span data-value="8">8</span>
        </span>
      ) : (
        <span className="game-icon__snake">
          <svg viewBox="0 0 64 64" role="presentation">
            <path
              d="M13 42h16a7 7 0 0 0 7-7V24a7 7 0 0 1 7-7h12"
              fill="none"
              stroke="url(#snakeIconStroke)"
              strokeWidth="8"
              strokeLinecap="round"
            />
            <defs>
              <linearGradient id="snakeIconStroke" x1="13" y1="42" x2="55" y2="17">
                <stop stopColor="#34d399" />
                <stop offset="1" stopColor="#22d3ee" />
              </linearGradient>
            </defs>
            <circle cx="17" cy="42" r="3" fill="#0b1220" />
            <circle cx="15.5" cy="40.5" r="1.2" fill="#a7f3d0" />
            <circle cx="49" cy="20" r="3.4" fill="#fb7185" />
          </svg>
        </span>
      )}
    </span>
  )
}

const ART_BOARD = [
  2, 4, 0, 8,
  16, 32, 2, 0,
  64, 0, 128, 4,
  0, 256, 512, 1024,
]

const MERGED_BOARD = [
  4, 8, 16, 2,
  32, 64, 0, 8,
  256, 128, 32, 16,
  1024, 2048, 0, 64,
]

const LATE_BOARD = [
  8, 16, 32, 64,
  128, 256, 512, 2,
  1024, 2048, 4096, 8,
  16, 32, 64, 128,
]

export function Mini2048Board({
  values = ART_BOARD,
  compact = false,
}: {
  values?: number[]
  compact?: boolean
}) {
  return (
    <div className={`mini-2048 ${compact ? 'mini-2048--compact' : ''}`} aria-hidden>
      {values.map((value, index) => (
        <span
          key={`${index}-${value}`}
          className={`num-tile ${value === 0 ? 'num-tile--empty' : ''}`}
          data-value={value === 0 ? undefined : tileTone(value)}
        >
          {value === 0 ? '' : value}
        </span>
      ))}
    </div>
  )
}

export function HeroArt({ game }: { game: Game }) {
  return (
    <div className={`hero-art hero-art--${game.art}`} aria-hidden>
      {game.art === '2048' ? (
        <>
          <div className="hero-art__halo hero-art__halo--one" />
          <div className="hero-art__halo hero-art__halo--two" />
          <div className="hero-art__board">
            <div className="hero-art__board-top">
              <span>2048</span>
              <span className="hero-art__score">12,480</span>
            </div>
            <Mini2048Board values={ART_BOARD} />
          </div>
        </>
      ) : (
        <>
          <div className="hero-art__halo hero-art__halo--one" />
          <SnakeScene scene="play" />
        </>
      )}
    </div>
  )
}

export function FeatureArt({ game }: { game: Game }) {
  return (
    <div className={`feature-art feature-art--${game.art}`} aria-hidden>
      {game.art === '2048' ? (
        <Mini2048Board values={MERGED_BOARD} compact />
      ) : (
        <SnakeScene scene="mid" />
      )}
    </div>
  )
}

export function SnakeScene({ scene = 'play' }: { scene?: 'start' | 'play' | 'mid' | 'over' }) {
  const snakePath =
    scene === 'mid'
      ? 'M48 190H138a26 26 0 0 0 26-26v-34a26 26 0 0 1 26-26h96'
      : scene === 'over'
        ? 'M52 188h88a30 30 0 0 0 30-30v-26a30 30 0 0 1 30-30h34'
        : 'M44 200h116a28 28 0 0 0 28-28v-28a28 28 0 0 1 28-28h58'
  return (
    <div className={`snake-scene snake-scene--${scene}`} aria-hidden>
      <svg viewBox="0 0 320 240" role="presentation">
        <defs>
          <linearGradient id={`snakeBody-${scene}`} x1="0" y1="1" x2="1" y2="0">
            <stop stopColor="#10b981" />
            <stop offset="1" stopColor="#22d3ee" />
          </linearGradient>
          <radialGradient id={`foodGlow-${scene}`}>
            <stop stopColor="#fb7185" stopOpacity=".8" />
            <stop offset="1" stopColor="#fb7185" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect x="0" y="0" width="320" height="240" rx="20" fill="#0b1220" />
        <g stroke="rgba(148, 233, 255, .08)" strokeWidth="1">
          {Array.from({ length: 9 }, (_, index) => (
            <line key={`v${index}`} x1={24 + index * 34} y1="18" x2={24 + index * 34} y2="222" />
          ))}
          {Array.from({ length: 7 }, (_, index) => (
            <line key={`h${index}`} x1="24" y1={18 + index * 34} x2="296" y2={18 + index * 34} />
          ))}
        </g>
        <circle cx="262" cy="78" r="26" fill={`url(#foodGlow-${scene})`} />
        <circle cx="262" cy="78" r="7" fill="#fb7185" />
        <path
          d={snakePath}
          fill="none"
          stroke={`url(#snakeBody-${scene})`}
          strokeWidth="20"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d={snakePath}
          fill="none"
          stroke="rgba(255, 255, 255, .18)"
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
          transform="translate(-3 -3)"
        />
        <circle cx={scene === 'mid' ? 48 : 52} cy={scene === 'mid' ? 190 : 188} r="4.5" fill="#0b1220" />
        <circle cx={scene === 'mid' ? 48 : 52} cy={scene === 'mid' ? 187 : 185} r="1.8" fill="#d1fae5" />
        {scene === 'over' ? (
          <g>
            <rect x="80" y="92" width="160" height="56" rx="16" fill="rgba(8, 15, 26, .86)" stroke="rgba(255,255,255,.12)" />
            <text x="160" y="116" textAnchor="middle" fill="#f8fafc" fontSize="13" fontWeight="600">
              本局结束
            </text>
            <text x="160" y="135" textAnchor="middle" fill="#94a3b8" fontSize="10">
              得分 120 · 最高 320
            </text>
          </g>
        ) : null}
      </svg>
    </div>
  )
}

export function GamePreview({
  game,
  scene,
  caption,
}: {
  game: Game
  scene: 1 | 2 | 3
  caption: string
}) {
  const merged = scene === 1 ? ART_BOARD : scene === 2 ? MERGED_BOARD : LATE_BOARD
  return (
    <figure className="game-preview">
      <div className={`game-preview__screen game-preview__screen--${game.art}`}>
        <div className="game-preview__bar">
          <span className="game-preview__dot" />
          <span>{game.name}</span>
          <span className="game-preview__score">
            {game.art === '2048' ? `得分 ${scene === 1 ? '1,284' : scene === 2 ? '3,920' : '8,016'}` : `得分 ${scene === 1 ? '30' : scene === 2 ? '120' : '280'}`}
          </span>
        </div>
        {game.art === '2048' ? (
          <Mini2048Board values={merged} compact />
        ) : (
          <SnakeScene scene={scene === 1 ? 'start' : scene === 2 ? 'mid' : 'over'} />
        )}
      </div>
      <figcaption>{caption}</figcaption>
    </figure>
  )
}

export function EmptyArtwork({ title, message }: { title: string; message: string }) {
  return (
    <div className="empty-art">
      <div className="empty-art__orb" aria-hidden>
        <span />
        <span />
        <span />
      </div>
      <h3>{title}</h3>
      <p>{message}</p>
    </div>
  )
}
