import type { ReactNode } from 'react'
import type { Game } from '../data/catalog'
import { useLibrary } from '../context/LibraryContext'
import { href, navigate } from '../hooks/useHashRoute'
import {
  AppleLikeMark,
  ArrowRightIcon,
  ChartIcon,
  ChevronLeftIcon,
  GamesIcon,
  HeartIcon,
  PlayGlyph,
  SearchIcon,
  StarIcon,
  TodayIcon,
} from './Icons'

export function RatingStars({
  rating,
  size = 13,
  className = '',
}: {
  rating: number
  size?: number
  className?: string
}) {
  const percent = Math.max(0, Math.min(100, (rating / 5) * 100))
  const stars = Array.from({ length: 5 }, (_, index) => (
    <StarIcon key={index} size={size} />
  ))
  return (
    <span className={`rating-stars ${className}`.trim()} aria-hidden>
      <span className="rating-stars__empty">{stars}</span>
      <span className="rating-stars__fill" style={{ width: `${percent}%` }}>
        {stars}
      </span>
    </span>
  )
}

export function RatingLine({ game, size = 13 }: { game: Game; size?: number }) {
  return (
    <span className="rating-line">
      <RatingStars rating={game.rating} size={size} />
      <span className="rating-line__value">{game.rating.toFixed(1)}</span>
      <span className="rating-line__count">({game.ratingCount})</span>
    </span>
  )
}

export function SectionHeader({
  eyebrow,
  title,
  actionLabel,
  actionHref,
}: {
  eyebrow?: string
  title: ReactNode
  actionLabel?: string
  actionHref?: string
}) {
  return (
    <div className="section-header">
      <div>
        {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
        <h2>{title}</h2>
      </div>
      {actionLabel && actionHref ? (
        <a className="text-link" href={href(actionHref)}>
          {actionLabel}
          <ArrowRightIcon size={15} />
        </a>
      ) : null}
    </div>
  )
}

export function PageIntro({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow?: string
  title: string
  description?: string
  children?: ReactNode
}) {
  return (
    <header className="page-intro">
      {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
      <h1>{title}</h1>
      {description ? <p className="page-intro__description">{description}</p> : null}
      {children ? <div className="page-intro__extra">{children}</div> : null}
    </header>
  )
}

export function BackButton({ fallback = '/games', label = '返回' }: { fallback?: string; label?: string }) {
  return (
    <button
      type="button"
      className="back-button"
      onClick={() => {
        if (window.history.length > 1) window.history.back()
        else navigate(fallback)
      }}
    >
      <ChevronLeftIcon size={18} />
      {label}
    </button>
  )
}

export function FavoriteButton({ game }: { game: Game }) {
  const { isFavorite, toggleFavorite } = useLibrary()
  const active = isFavorite(game.id)
  return (
    <button
      type="button"
      className={`favorite-button ${active ? 'is-active' : ''}`}
      aria-pressed={active}
      aria-label={active ? `取消收藏 ${game.name}` : `收藏 ${game.name}`}
      onClick={() => toggleFavorite(game.id)}
    >
      <HeartIcon size={20} filled={active} />
      <span>{active ? '已收藏' : '收藏'}</span>
    </button>
  )
}

export function GamePlayButton({
  game,
  variant = 'solid',
  labelOverride,
}: {
  game: Game
  variant?: 'solid' | 'pill' | 'ghost'
  labelOverride?: string
}) {
  const { recent } = useLibrary()
  const played = recent.some((entry) => entry.id === game.id)
  const label = labelOverride ?? (played ? '打开' : '获取')
  return (
    <a
      className={`play-button play-button--${variant}`}
      href={href(`/play/${game.id}`)}
      onClick={(event) => {
        event.stopPropagation()
      }}
    >
      <PlayGlyph size={14} />
      {label}
    </a>
  )
}

export function GameCard({ game }: { game: Game }) {
  return (
    <article className="game-card">
      <a className={`game-card__art game-card__art--${game.art}`} href={href(`/game/${game.id}`)} aria-label={`查看 ${game.name} 详情`}>
        {game.art === '2048' ? (
          <span className="game-card__art-tiles" aria-hidden>
            <span data-value="2">2</span>
            <span data-value="8">8</span>
            <span data-value="16">16</span>
            <span data-value="32">32</span>
          </span>
        ) : (
          <span className="game-card__art-snake" aria-hidden>
            <svg viewBox="0 0 240 160" role="presentation">
              <path
                d="M30 120h50a20 20 0 0 0 20-20V82a20 20 0 0 1 20-20h60"
                fill="none"
                stroke="url(#cardSnake)"
                strokeWidth="18"
                strokeLinecap="round"
              />
              <defs>
                <linearGradient id="cardSnake" x1="0" y1="1" x2="1" y2="0">
                  <stop stopColor="#10b981" />
                  <stop offset="1" stopColor="#22d3ee" />
                </linearGradient>
              </defs>
              <circle cx="192" cy="62" r="8" fill="#fb7185" />
            </svg>
          </span>
        )}
      </a>
      <div className="game-card__body">
        <div className="game-card__heading">
          <div>
            <h3>
              <a href={href(`/game/${game.id}`)}>{game.name}</a>
            </h3>
            <p>{game.tagline}</p>
          </div>
          <GamePlayButton game={game} variant="pill" />
        </div>
        <div className="game-card__meta">
          <RatingStars rating={game.rating} />
          <span>{game.rating.toFixed(1)}</span>
          <span>{game.categories.map(slugName).join(' · ')}</span>
          <span>{game.ageRating}</span>
        </div>
      </div>
    </article>
  )
}

function slugName(slug: string): string {
  const names: Record<string, string> = {
    puzzle: '益智',
    arcade: '街机',
    casual: '休闲',
    reflex: '反应',
  }
  return names[slug] ?? slug
}

export function GameRow({ game }: { game: Game }) {
  return (
    <div className="game-row">
      <a className={`game-row__icon game-row__icon--${game.art}`} href={href(`/game/${game.id}`)} aria-hidden tabIndex={-1}>
        {game.art === '2048' ? (
          <span className="game-row__tiles">
            <span>2</span>
            <span>0</span>
            <span>4</span>
            <span>8</span>
          </span>
        ) : (
          <svg viewBox="0 0 64 64" role="presentation">
            <path
              d="M14 42h14a7 7 0 0 0 7-7V25a7 7 0 0 1 7-7h10"
              fill="none"
              stroke="#34d399"
              strokeWidth="7"
              strokeLinecap="round"
            />
            <circle cx="49" cy="21" r="3.4" fill="#fb7185" />
          </svg>
        )}
      </a>
      <div className="game-row__info">
        <h3>
          <a href={href(`/game/${game.id}`)}>{game.name}</a>
        </h3>
        <p>{game.tagline}</p>
        <div className="game-row__meta">
          <RatingLine game={game} size={11} />
          <span className="game-row__dot">·</span>
          <span>{game.ageRating}</span>
        </div>
      </div>
      <GamePlayButton game={game} variant="pill" />
    </div>
  )
}

export function SiteHeader({ path }: { path: string }) {
  const links = [
    { to: '/', label: 'Today', icon: <TodayIcon size={17} /> },
    { to: '/games', label: '游戏', icon: <GamesIcon size={17} /> },
    { to: '/charts', label: '排行榜', icon: <ChartIcon size={17} /> },
  ]
  const isActive = (to: string) =>
    to === '/'
      ? path === '/'
      : path === to ||
        path.startsWith(`${to}/`) ||
        (to === '/games' && (path.startsWith('/category') || path.startsWith('/game/')))

  return (
    <header className="site-header">
      <div className="site-header__inner">
        <a className="brand" href={href('/')} aria-label="小玩商店首页">
          <span className="brand__mark">
            <AppleLikeMark size={23} />
          </span>
          <span className="brand__name">小玩商店</span>
          <span className="brand__en">MiniPlay</span>
        </a>
        <nav className="site-nav" aria-label="主导航">
          {links.map((link) => (
            <a
              key={link.to}
              className={`site-nav__link ${isActive(link.to) ? 'is-active' : ''}`}
              href={href(link.to)}
              aria-current={isActive(link.to) ? 'page' : undefined}
            >
              {link.icon}
              {link.label}
            </a>
          ))}
        </nav>
        <div className="site-header__actions">
          <a
            className={`icon-button ${path === '/search' ? 'is-active' : ''}`}
            href={href('/search')}
            aria-label="搜索游戏"
            title="搜索"
          >
            <SearchIcon size={19} />
          </a>
        </div>
      </div>
    </header>
  )
}

export function BottomTabBar({ path }: { path: string }) {
  const links = [
    { to: '/', label: 'Today', icon: <TodayIcon size={21} /> },
    { to: '/games', label: '游戏', icon: <GamesIcon size={21} /> },
    { to: '/charts', label: '排行榜', icon: <ChartIcon size={21} /> },
    { to: '/search', label: '搜索', icon: <SearchIcon size={21} /> },
  ]
  const isActive = (to: string) =>
    to === '/'
      ? path === '/'
      : path === to ||
        path.startsWith(`${to}/`) ||
        (to === '/games' && (path.startsWith('/category') || path.startsWith('/game/')))

  return (
    <nav className="tab-bar" aria-label="底部导航">
      {links.map((link) => (
        <a
          key={link.to}
          className={`tab-bar__item ${isActive(link.to) ? 'is-active' : ''}`}
          href={href(link.to)}
          aria-current={isActive(link.to) ? 'page' : undefined}
        >
          {link.icon}
          <span>{link.label}</span>
        </a>
      ))}
    </nav>
  )
}

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <div className="site-footer__brand">
          <span className="brand__mark brand__mark--small">
            <AppleLikeMark size={19} />
          </span>
          <div>
            <p className="site-footer__name">小玩商店 MiniPlay</p>
            <p className="site-footer__note">发现好玩的小游戏，打开就能玩。</p>
          </div>
        </div>
        <nav className="site-footer__links" aria-label="页脚导航">
          <a href={href('/')}>Today</a>
          <a href={href('/games')}>全部游戏</a>
          <a href={href('/charts')}>排行榜</a>
          <a href={href('/about')}>关于平台</a>
        </nav>
        <p className="site-footer__legal">© 2026 小玩商店 · 所有游戏均可直接在浏览器中游玩</p>
      </div>
    </footer>
  )
}
