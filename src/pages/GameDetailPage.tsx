import { useMemo } from 'react'
import {
  GAMES,
  getCategory,
  getGame,
  type Game,
} from '../data/catalog'
import { href } from '../hooks/useHashRoute'
import { useLibrary } from '../context/LibraryContext'
import { GameIcon, GamePreview } from '../components/GameArt'
import {
  BackButton,
  FavoriteButton,
  RatingLine,
  RatingStars,
  SectionHeader,
} from '../components/Chrome'
import {
  ArrowRightIcon,
  CheckIcon,
  ChevronLeftIcon,
  PlayGlyph,
  StarIcon,
} from '../components/Icons'

const CATEGORY_NAMES: Record<string, string> = {
  puzzle: '益智',
  arcade: '街机',
  casual: '休闲',
  reflex: '反应',
}

function categoryNames(game: Game): string {
  return game.categories.map((slug) => CATEGORY_NAMES[slug] ?? slug).join(' · ')
}

export function GameDetailPage({ gameId }: { gameId: string }) {
  const game = getGame(gameId)
  const { recent, best } = useLibrary()

  const otherGames = useMemo(
    () => GAMES.filter((entry) => entry.id !== gameId),
    [gameId],
  )

  if (!game) {
    return (
      <main id="main" className="page page--narrow">
        <div className="not-found">
          <p className="eyebrow">游戏不存在</p>
          <h1>这款游戏还没上架</h1>
          <p>它可能还在开发者的草稿箱里。先看看已经上架的作品吧。</p>
          <a className="button button--primary" href={href('/games')}>
            浏览全部游戏
          </a>
        </div>
      </main>
    )
  }

  const played = recent.some((entry) => entry.id === game.id)
  const bestScore = best[game.id]
  const categories = game.categories
    .map((slug) => getCategory(slug))
    .filter((category): category is NonNullable<typeof category> => Boolean(category))
  const relatedCategory = categories.find((category) => category.slug !== 'casual') ?? categories[0]

  const previews =
    game.art === '2048'
      ? [
          { scene: 1 as const, caption: '滑动合并相同的数字' },
          { scene: 2 as const, caption: '一步撤销，给思考留余地' },
          { scene: 3 as const, caption: '继续挑战更大的数字' },
        ]
      : [
          { scene: 1 as const, caption: '吃掉发光果实，身体变长' },
          { scene: 2 as const, caption: '速度会随着分数越来越快' },
          { scene: 3 as const, caption: '撞到边界或自己，本局结束' },
        ]

  return (
    <main id="main" className="page page--detail">
      <div className="detail-back">
        <BackButton fallback="/games" />
        <span className="detail-back__trail">
          <a href={href('/games')}>游戏</a>
          <span aria-hidden>/</span>
          <span>{game.name}</span>
        </span>
      </div>

      <header className="detail-head">
        <div className="detail-head__main">
          <GameIcon game={game} size={116} className="detail-icon" />
          <div className="detail-head__copy">
            <p className="eyebrow">{categoryNames(game)}</p>
            <h1>{game.name}</h1>
            <p className="detail-head__tagline">{game.tagline}</p>
            <p className="detail-head__dev">{game.developer}</p>
            <div className="detail-head__actions">
              <a className="button button--primary button--play" href={href(`/play/${game.id}`)}>
                <PlayGlyph size={16} />
                {played ? '继续玩' : '开始游戏'}
              </a>
              <FavoriteButton game={game} />
            </div>
            <p className="detail-head__note">
              免费 · 无需下载
              {bestScore ? ` · 你的最高分 ${bestScore.toLocaleString('zh-CN')}` : ''}
            </p>
          </div>
        </div>
        <div className="detail-facts">
          <div className="detail-fact">
            <span className="detail-fact__label">评分</span>
            <span className="detail-fact__value">
              <RatingStars rating={game.rating} size={12} />
              {game.rating.toFixed(1)}
            </span>
            <span className="detail-fact__sub">{game.ratingCount} 个评分</span>
          </div>
          <div className="detail-fact">
            <span className="detail-fact__label">分区</span>
            <span className="detail-fact__value">{categories[0]?.name}</span>
            <span className="detail-fact__sub">{categories.length} 个分区</span>
          </div>
          <div className="detail-fact">
            <span className="detail-fact__label">年龄</span>
            <span className="detail-fact__value">{game.ageRating}</span>
            <span className="detail-fact__sub">所有年龄段</span>
          </div>
          <div className="detail-fact">
            <span className="detail-fact__label">大小</span>
            <span className="detail-fact__value">{game.size}</span>
            <span className="detail-fact__sub">即时加载</span>
          </div>
        </div>
      </header>

      <section className="screenshot-section" aria-labelledby="screenshots-title">
        <div className="section-header section-header--compact">
          <div>
            <p className="eyebrow">Preview</p>
            <h2 id="screenshots-title">游戏预览</h2>
          </div>
          <span className="screenshot-hint">左右滑动查看更多</span>
        </div>
        <div className="screenshot-rail">
          {previews.map((preview) => (
            <GamePreview
              key={`${game.id}-${preview.scene}`}
              game={game}
              scene={preview.scene}
              caption={preview.caption}
            />
          ))}
        </div>
      </section>

      <div className="detail-layout">
        <div className="detail-main">
          <section className="detail-section" aria-labelledby="ratings-title">
            <div className="detail-section__head">
              <h2 id="ratings-title">评分与评价</h2>
              <span className="detail-section__meta">全部 {game.ratingCount} 个评分</span>
            </div>
            <div className="ratings-panel">
              <div className="ratings-summary">
                <span className="ratings-summary__value">{game.rating.toFixed(1)}</span>
                <span className="ratings-summary__stars">
                  {Array.from({ length: 5 }, (_, index) => (
                    <StarIcon key={index} size={18} filled={index < Math.round(game.rating)} />
                  ))}
                </span>
                <span className="ratings-summary__caption">满分 5 分</span>
              </div>
              <div className="ratings-bars">
                {game.ratings.map((row) => (
                  <div className="rating-bar" key={row.stars}>
                    <span className="rating-bar__label">{row.stars} 星</span>
                    <span className="rating-bar__track">
                      <span className="rating-bar__fill" style={{ width: `${row.percent}%` }} />
                    </span>
                    <span className="rating-bar__percent">{row.percent}%</span>
                  </div>
                ))}
              </div>
            </div>
            <p className="ratings-note">
              页面中的评分与评价为示例数据，用于展示商店信息结构。你的收藏与最高分只保存在自己的浏览器里。
            </p>
          </section>

          <section className="detail-section" aria-labelledby="about-title">
            <div className="detail-section__head">
              <h2 id="about-title">关于这款游戏</h2>
            </div>
            <div className="about-game">
              {game.description.map((paragraph) => (
                <p key={paragraph.slice(0, 12)}>{paragraph}</p>
              ))}
              <ul className="feature-list">
                {game.features.map((feature) => (
                  <li key={feature}>
                    <CheckIcon size={16} />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <section className="detail-section" aria-labelledby="controls-title">
            <div className="detail-section__head">
              <h2 id="controls-title">怎么玩</h2>
            </div>
            <ul className="controls-list">
              {game.controls.map((control) => (
                <li key={control}>{control}</li>
              ))}
            </ul>
          </section>
        </div>

        <aside className="detail-side">
          <section className="info-panel" aria-labelledby="info-title">
            <h2 id="info-title">信息</h2>
            <dl>
              <div>
                <dt>开发者</dt>
                <dd>{game.developer}</dd>
              </div>
              <div>
                <dt>分区</dt>
                <dd>{categories.map((category) => category.name).join('、')}</dd>
              </div>
              <div>
                <dt>版本</dt>
                <dd>{game.version}</dd>
              </div>
              <div>
                <dt>大小</dt>
                <dd>{game.size}</dd>
              </div>
              <div>
                <dt>更新日期</dt>
                <dd>{game.updated}</dd>
              </div>
              <div>
                <dt>语言</dt>
                <dd>{game.languages}</dd>
              </div>
              <div>
                <dt>兼容性</dt>
                <dd>{game.compatibility}</dd>
              </div>
              <div>
                <dt>年龄分级</dt>
                <dd>{game.ageRating} · 所有年龄段</dd>
              </div>
            </dl>
            <p className="info-panel__privacy">
              隐私说明：游戏不收集个人数据。收藏、最近游玩与最高分仅保存在本机浏览器中。
            </p>
          </section>

          <section className="more-panel" aria-labelledby="more-title">
            <div className="more-panel__head">
              <h2 id="more-title">更多小玩作品</h2>
              <span>{otherGames.length} 款</span>
            </div>
            {otherGames.map((other) => (
              <a className="more-game" key={other.id} href={href(`/game/${other.id}`)}>
                <GameIcon game={other} size={52} />
                <span className="more-game__copy">
                  <strong>{other.name}</strong>
                  <span>{other.tagline}</span>
                  <RatingLine game={other} size={11} />
                </span>
                <ArrowRightIcon size={16} />
              </a>
            ))}
            <a className="text-link more-panel__link" href={href('/games')}>
              浏览全部游戏
              <ArrowRightIcon size={14} />
            </a>
          </section>

          {relatedCategory ? (
            <a
              className={`side-category side-category--${relatedCategory.tone}`}
              href={href(`/category/${relatedCategory.slug}`)}
            >
              <span>
                <span className="eyebrow">Related</span>
                <strong>{relatedCategory.name}</strong>
                <span>{relatedCategory.blurb}</span>
              </span>
              <ChevronLeftIcon size={18} className="side-category__arrow" />
            </a>
          ) : null}
        </aside>
      </div>

      <section className="section">
        <SectionHeader
          eyebrow="Keep Exploring"
          title="再看看别的"
          actionLabel="全部游戏"
          actionHref="/games"
        />
        <div className="stack-card">
          {otherGames.map((other) => (
            <div className="detail-more-row" key={other.id}>
              <GameIcon game={other} size={54} />
              <div>
                <h3>
                  <a href={href(`/game/${other.id}`)}>{other.name}</a>
                </h3>
                <p>{other.tagline}</p>
              </div>
              <a className="text-link" href={href(`/game/${other.id}`)}>
                查看
                <ArrowRightIcon size={14} />
              </a>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}
