import { useMemo, useState } from 'react'
import {
  CATEGORIES,
  GAMES,
  gamesInCategory,
  getGame,
  type CategorySlug,
  type Game,
} from '../data/catalog'
import { href } from '../hooks/useHashRoute'
import { useLibrary } from '../context/LibraryContext'
import { GameIcon, EmptyArtwork } from '../components/GameArt'
import {
  GameCard,
  GamePlayButton,
  PageIntro,
  RatingLine,
  SectionHeader,
} from '../components/Chrome'
import {
  ArrowRightIcon,
  CategoryIcon,
  ChevronLeftIcon,
  HeartIcon,
  SparkIcon,
} from '../components/Icons'

export function GamesPage() {
  const [filter, setFilter] = useState<'all' | CategorySlug>('all')
  const { favorites } = useLibrary()

  const visible = filter === 'all' ? GAMES : gamesInCategory(filter)
  const activeCategory = CATEGORIES.find((category) => category.slug === filter)
  const favoriteGames = useMemo(
    () => favorites.map((id) => getGame(id)).filter((game): game is Game => Boolean(game)),
    [favorites],
  )

  return (
    <main id="main" className="page">
      <PageIntro
        eyebrow="Games"
        title="游戏"
        description="全部小游戏，随开随玩。没有下载，没有等待。"
      >
        <div className="filter-row" role="group" aria-label="按分区筛选游戏">
          <button
            type="button"
            className={`filter-chip ${filter === 'all' ? 'is-active' : ''}`}
            aria-pressed={filter === 'all'}
            onClick={() => setFilter('all')}
          >
            全部
            <span>{GAMES.length}</span>
          </button>
          {CATEGORIES.map((category) => (
            <button
              key={category.slug}
              type="button"
              className={`filter-chip ${filter === category.slug ? 'is-active' : ''}`}
              aria-pressed={filter === category.slug}
              onClick={() => setFilter(category.slug)}
            >
              {category.name}
              <span>{gamesInCategory(category.slug).length}</span>
            </button>
          ))}
        </div>
      </PageIntro>

      <div className="result-caption">
        <span>
          {activeCategory ? `${activeCategory.name} · ${activeCategory.blurb}` : '全部游戏'}
          <span className="result-caption__count">{visible.length} 款</span>
        </span>
        <a className="text-link" href={href('/charts')}>
          查看排行榜
          <ArrowRightIcon size={14} />
        </a>
      </div>

      {visible.length > 0 ? (
        <div className="game-grid">
          {visible.map((game) => (
            <GameCard key={game.id} game={game} />
          ))}
          <div className="coming-card">
            <span className="coming-card__icon">
              <SparkIcon size={26} />
            </span>
            <h3>下一款游戏正在打磨</h3>
            <p>我们会继续挑选规则轻、上手快的小游戏，慢慢把商店填满。</p>
            <span className="coming-card__tag">Coming soon</span>
          </div>
        </div>
      ) : (
        <EmptyArtwork title="这个分区还空着" message="游戏正在路上，先去别的分区逛逛吧。" />
      )}

      {favoriteGames.length > 0 ? (
        <section className="section">
          <SectionHeader
            eyebrow="Your Collection"
            title={
              <span className="inline-icon">
                <HeartIcon size={19} filled /> 我的收藏
              </span>
            }
          />
          <div className="stack-card">
            {favoriteGames.map((game) => (
              <div className="game-row" key={game.id}>
                <GameIcon game={game} size={52} />
                <div className="game-row__info">
                  <h3>
                    <a href={href(`/game/${game.id}`)}>{game.name}</a>
                  </h3>
                  <p>{game.tagline}</p>
                  <RatingLine game={game} size={11} />
                </div>
                <GamePlayButton game={game} variant="pill" />
              </div>
            ))}
          </div>
        </section>
      ) : null}

      <section className="section">
        <SectionHeader title="按分区发现" eyebrow="Categories" />
        <div className="category-list">
          {CATEGORIES.map((category) => {
            const count = gamesInCategory(category.slug).length
            return (
              <a
                key={category.slug}
                className={`category-row category-row--${category.tone}`}
                href={href(`/category/${category.slug}`)}
              >
                <span className="category-row__icon">
                  <CategoryIcon icon={category.icon} size={22} />
                </span>
                <span className="category-row__copy">
                  <strong>{category.name}</strong>
                  <span>{category.blurb}</span>
                </span>
                <span className="category-row__count">{count} 款</span>
                <ArrowRightIcon size={16} />
              </a>
            )
          })}
        </div>
      </section>
    </main>
  )
}

export function CategoryPage({ slug }: { slug: string }) {
  const category = CATEGORIES.find((entry) => entry.slug === slug)
  if (!category) {
    return (
      <main id="main" className="page page--narrow">
        <div className="not-found">
          <p className="eyebrow">分区不存在</p>
          <h1>没有找到这个分区</h1>
          <p>它可能还没上线。先去看看全部游戏吧。</p>
          <a className="button button--primary" href={href('/games')}>
            全部游戏
          </a>
        </div>
      </main>
    )
  }

  const games = gamesInCategory(category.slug)

  return (
    <main id="main" className="page">
      <div className="breadcrumb">
        <a href={href('/games')}>
          <ChevronLeftIcon size={16} />
          游戏
        </a>
        <span aria-hidden>/</span>
        <span>{category.name}</span>
      </div>
      <header className={`category-hero category-hero--${category.tone}`}>
        <span className="category-hero__icon">
          <CategoryIcon icon={category.icon} size={30} />
        </span>
        <div>
          <p className="eyebrow">Category</p>
          <h1>{category.name}</h1>
          <p>{category.blurb} · 共 {games.length} 款游戏</p>
        </div>
      </header>

      {games.length > 0 ? (
        <div className="game-grid">
          {games.map((game) => (
            <GameCard key={game.id} game={game} />
          ))}
          <div className="coming-card">
            <span className="coming-card__icon">
              <SparkIcon size={26} />
            </span>
            <h3>这个分区还会更新</h3>
            <p>我们正在为「{category.name}」挑选下一款合适的作品，请慢慢等它上架。</p>
            <span className="coming-card__tag">More coming</span>
          </div>
        </div>
      ) : (
        <EmptyArtwork title="这个分区还空着" message="我们正在为它挑选合适的游戏，敬请期待。" />
      )}

      <section className="section">
        <SectionHeader title="其他分区" eyebrow="Keep Browsing" />
        <div className="category-list">
          {CATEGORIES.filter((entry) => entry.slug !== category.slug).map((entry) => (
            <a
              key={entry.slug}
              className={`category-row category-row--${entry.tone}`}
              href={href(`/category/${entry.slug}`)}
            >
              <span className="category-row__icon">
                <CategoryIcon icon={entry.icon} size={22} />
              </span>
              <span className="category-row__copy">
                <strong>{entry.name}</strong>
                <span>{entry.blurb}</span>
              </span>
              <ArrowRightIcon size={16} />
            </a>
          ))}
        </div>
      </section>
    </main>
  )
}
