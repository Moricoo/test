import { useState } from 'react'
import { GAMES, POPULAR_SEARCHES, gamesMatching, getGame, type Game } from '../data/catalog'
import { href } from '../hooks/useHashRoute'
import { GameIcon } from '../components/GameArt'
import { GamePlayButton, PageIntro, RatingLine } from '../components/Chrome'
import { TrophyIcon } from '../components/Icons'

type ChartKind = 'free' | 'editors' | 'new'

const CHART_TABS: { id: ChartKind; label: string; note: string }[] = [
  { id: 'free', label: '免费游戏榜', note: '按评分数量排序的示例榜单' },
  { id: 'editors', label: '编辑推荐榜', note: '由编辑挑选，按评分排序' },
  { id: 'new', label: '新游榜', note: '按上线时间排序，同日上线按名称排列' },
]

function rankedGames(kind: ChartKind): Game[] {
  const list = [...GAMES]
  if (kind === 'free') return list.sort((a, b) => b.ratingCount - a.ratingCount)
  if (kind === 'editors') return list.sort((a, b) => b.rating - a.rating)
  return list.sort((a, b) => a.name.localeCompare(b.name))
}

function RankNumber({ rank }: { rank: number }) {
  return (
    <span className={`rank-number rank-number--${rank <= 3 ? rank : 'rest'}`} aria-label={`第 ${rank} 名`}>
      {rank}
    </span>
  )
}

export function ChartsPage() {
  const [kind, setKind] = useState<ChartKind>('free')
  const ranked = rankedGames(kind)
  const activeTab = CHART_TABS.find((tab) => tab.id === kind) ?? CHART_TABS[0]
  const leader = ranked[0]

  return (
    <main id="main" className="page">
      <PageIntro
        eyebrow="Top Charts"
        title="排行榜"
        description="看看这一期榜单里的作品。榜单展示商店的排序与分区方式，具体数据为示例。"
      />

      <div className="segmented" role="tablist" aria-label="排行榜类型">
        {CHART_TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={kind === tab.id}
            className={`segmented__item ${kind === tab.id ? 'is-active' : ''}`}
            onClick={() => setKind(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {leader ? (
        <section className="chart-leader">
          <div className="chart-leader__copy">
            <p className="eyebrow eyebrow--light">No.1 · 本期榜首</p>
            <h2>{leader.name}</h2>
            <p>{leader.tagline}</p>
            <div className="chart-leader__meta">
              <GameIcon game={leader} size={42} />
              <span>
                <RatingLine game={leader} size={12} />
                <span className="chart-leader__dev">{leader.developer}</span>
              </span>
            </div>
            <a className="button button--light" href={href(`/play/${leader.id}`)}>
              立即开玩
            </a>
          </div>
          <div className={`chart-leader__art chart-leader__art--${leader.art}`} aria-hidden>
            <div className="chart-leader__trophy">
              <TrophyIcon size={22} />
            </div>
            {leader.art === '2048' ? (
              <span className="chart-leader__tiles">
                <span>2</span>
                <span>0</span>
                <span>4</span>
                <span>8</span>
              </span>
            ) : (
              <span className="chart-leader__snake">
                <svg viewBox="0 0 200 160" role="presentation">
                  <path
                    d="M24 124h58a22 22 0 0 0 22-22V76a22 22 0 0 1 22-22h50"
                    fill="none"
                    stroke="#34d399"
                    strokeWidth="16"
                    strokeLinecap="round"
                  />
                  <circle cx="162" cy="54" r="6" fill="#fb7185" />
                </svg>
              </span>
            )}
          </div>
        </section>
      ) : null}

      <div className="chart-panel">
        <div className="chart-panel__head">
          <div className="chart-panel__title">
            <TrophyIcon size={18} />
            <h2>{activeTab.label}</h2>
          </div>
          <p>{activeTab.note}</p>
        </div>
        <ol className="chart-list">
          {ranked.map((game, index) => (
            <li key={game.id} className="chart-row">
              <RankNumber rank={index + 1} />
              <a
                className={`chart-row__icon chart-row__icon--${game.art}`}
                href={href(`/game/${game.id}`)}
                aria-label={`查看 ${game.name} 详情`}
              >
                <GameIcon game={game} size={58} />
              </a>
              <div className="chart-row__info">
                <h3>
                  <a href={href(`/game/${game.id}`)}>{game.name}</a>
                </h3>
                <p>{game.tagline}</p>
                <div className="chart-row__meta">
                  <RatingLine game={game} size={11} />
                  <span>·</span>
                  <span>
                    {game.categories
                      .map((slug) => {
                        const names: Record<string, string> = {
                          puzzle: '益智',
                          arcade: '街机',
                          casual: '休闲',
                          reflex: '反应',
                        }
                        return names[slug]
                      })
                      .join(' / ')}
                  </span>
                </div>
              </div>
              <span className="chart-row__age">{game.ageRating}</span>
              <GamePlayButton game={game} variant="pill" />
            </li>
          ))}
        </ol>
      </div>

      <section className="section">
        <div className="chart-footnote">
          <p>
            榜单为示例数据，按评分数量排序，用于展示商店信息结构。
            本站不包含付费游戏，所有作品都可以直接游玩。
          </p>
          <a className="text-link" href={href('/games')}>
            浏览全部游戏
          </a>
        </div>
      </section>
    </main>
  )
}

export function SearchPage({ initialQuery = '' }: { initialQuery?: string }) {
  const [query, setQuery] = useState(initialQuery)
  const needle = query.trim().toLowerCase()
  const results = needle ? gamesMatching(query) : []
  const suggestions = POPULAR_SEARCHES
  const pickedGame = needle ? getGame(query.trim()) : undefined

  return (
    <main id="main" className="page page--search">
      <PageIntro eyebrow="Search" title="搜索" />
      <div className="search-box">
        <span className="search-box__icon" aria-hidden>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="6.5" />
            <path d="m16 16 4.2 4.2" strokeLinecap="round" />
          </svg>
        </span>
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="搜索游戏、分区或开发者"
          aria-label="搜索游戏"
          autoComplete="off"
          spellCheck={false}
        />
        {query ? (
          <button
            type="button"
            className="search-box__clear"
            onClick={() => setQuery('')}
            aria-label="清空搜索"
          >
            清除
          </button>
        ) : null}
      </div>

      {!needle ? (
        <>
          <section className="search-section">
            <h2 className="search-section__title">热门搜索</h2>
            <div className="search-chips">
              {suggestions.map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  className="search-chip"
                  onClick={() => setQuery(suggestion)}
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </section>
          <section className="search-section">
            <h2 className="search-section__title">随便看看</h2>
            <div className="search-suggest-grid">
              {GAMES.map((game) => (
                <a key={game.id} className="search-suggest" href={href(`/game/${game.id}`)}>
                  <GameIcon game={game} size={56} />
                  <span>
                    <strong>{game.name}</strong>
                    <span>{game.tagline}</span>
                  </span>
                </a>
              ))}
            </div>
          </section>
        </>
      ) : results.length > 0 ? (
        <section className="search-section">
          <h2 className="search-section__title">
            {pickedGame ? '直接打开' : `找到 ${results.length} 个结果`}
          </h2>
          {pickedGame ? (
            <a className="search-hit" href={href(`/play/${pickedGame.id}`)}>
              <GameIcon game={pickedGame} size={56} />
              <span>
                <strong>立即游玩《{pickedGame.name}》</strong>
                <span>{pickedGame.tagline}</span>
              </span>
            </a>
          ) : null}
          <div className="search-results">
            {results.map((game) => (
              <a key={game.id} className="search-result" href={href(`/game/${game.id}`)}>
                <GameIcon game={game} size={58} />
                <span className="search-result__copy">
                  <strong>{game.name}</strong>
                  <span>{game.tagline}</span>
                  <RatingLine game={game} size={11} />
                </span>
                <span className="search-result__cta">查看</span>
              </a>
            ))}
          </div>
        </section>
      ) : (
        <div className="search-empty">
          <span className="search-empty__orb" aria-hidden />
          <h2>没有找到「{query.trim()}」</h2>
          <p>试试游戏名、分区或者开发者名称，比如「2048」「益智」「小玩工作室」。</p>
          <div className="search-chips">
            {suggestions.slice(0, 3).map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                className="search-chip"
                onClick={() => setQuery(suggestion)}
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}

      <section className="section">
        <div className="search-tip">
          <span>小提示</span>
          <p>搜索「小玩工作室」可以找到我们的全部作品。收藏和最高分只保存在你的浏览器里。</p>
        </div>
      </section>
    </main>
  )
}
