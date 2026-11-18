import { useState } from 'react'
import {
  CATEGORIES,
  FEATURED_GAME_ID,
  GAMES,
  gamesInCategory,
  getGame,
  type Category,
  type Game,
} from '../data/catalog'
import { href } from '../hooks/useHashRoute'
import { useLibrary } from '../context/LibraryContext'
import {
  FeatureArt,
  GameIcon,
  HeroArt,
} from '../components/GameArt'
import {
  GameRow,
  GamePlayButton,
  PageIntro,
  RatingLine,
  RatingStars,
  SectionHeader,
} from '../components/Chrome'
import {
  ArrowRightIcon,
  CategoryIcon,
  PlayGlyph,
  SparkIcon,
  TrophyIcon,
} from '../components/Icons'

function formatToday(): string {
  const formatter = new Intl.DateTimeFormat('zh-CN', {
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  })
  return formatter.format(new Date())
}

function Hero() {
  const game = getGame(FEATURED_GAME_ID)
  if (!game) return null
  return (
    <article className="hero">
      <div className="hero__content">
        <p className="eyebrow eyebrow--light">本周推荐 · Editor&apos;s Choice</p>
        <h2>{game.name}</h2>
        <p className="hero__tagline">轻推数字，合并出你的 2048。一场没有倒计时的数字游戏。</p>
        <div className="hero__meta">
          <GameIcon game={game} size={40} />
          <div>
            <p className="hero__developer">{game.developer}</p>
            <span className="hero__rating">
              <RatingStars rating={game.rating} size={12} />
              <span>{game.rating.toFixed(1)}</span>
              <span className="hero__rating-count">{game.ratingCount} 个评分</span>
            </span>
          </div>
        </div>
        <div className="hero__actions">
          <a className="button button--light" href={href(`/play/${game.id}`)}>
            <PlayGlyph size={14} />
            立即开玩
          </a>
          <a className="button button--glass" href={href(`/game/${game.id}`)}>
            查看详情
            <ArrowRightIcon size={15} />
          </a>
        </div>
      </div>
      <div className="hero__visual">
        <HeroArt game={game} />
      </div>
    </article>
  )
}

function FeatureCard({ game, index }: { game: Game; index: number }) {
  return (
    <a className="feature-card" href={href(`/game/${game.id}`)}>
      <div className="feature-card__art">
        <span className="feature-card__tag">
          {index === 0 ? '编辑精选' : '新游首发'}
        </span>
        <FeatureArt game={game} />
      </div>
      <div className="feature-card__body">
        <GameIcon game={game} size={52} />
        <div className="feature-card__copy">
          <h3>{game.name}</h3>
          <p>{game.tagline}</p>
          <RatingLine game={game} size={11} />
        </div>
        <span className="feature-card__arrow" aria-hidden>
          <ArrowRightIcon size={18} />
        </span>
      </div>
    </a>
  )
}

function CategoryCard({ category }: { category: Category }) {
  const count = gamesInCategory(category.slug).length
  return (
    <a className={`category-card category-card--${category.tone}`} href={href(`/category/${category.slug}`)}>
      <span className="category-card__icon">
        <CategoryIcon icon={category.icon} size={24} />
      </span>
      <span className="category-card__name">{category.name}</span>
      <span className="category-card__blurb">{category.blurb}</span>
      <span className="category-card__count">
        {count} 款游戏
        <ArrowRightIcon size={14} />
      </span>
    </a>
  )
}

function ChartPreviewRow({ game, rank }: { game: Game; rank: number }) {
  return (
    <div className="chart-preview__row">
      <span className="chart-preview__rank" aria-hidden>
        {rank}
      </span>
      <GameIcon game={game} size={46} />
      <div className="chart-preview__info">
        <h4>
          <a href={href(`/game/${game.id}`)}>{game.name}</a>
        </h4>
        <p>{game.tagline}</p>
      </div>
      <span className="chart-preview__rating">
        <RatingStars rating={game.rating} size={11} />
        <span>{game.ratingCount}</span>
      </span>
      <GamePlayButton game={game} variant="pill" />
    </div>
  )
}

export function TodayPage() {
  const { recent } = useLibrary()
  const [today] = useState(formatToday)
  const recentGames = recent
    .map((entry) => getGame(entry.id))
    .filter((game): game is Game => Boolean(game))
    .slice(0, 2)

  return (
    <main id="main" className="page page--today">
      <div className="today-head">
        <p className="eyebrow eyebrow--accent">
          <time>{today}</time>
        </p>
        <h1 className="today-title">Today</h1>
        <p className="today-sub">每天发现一款值得打开的小游戏。</p>
      </div>

      <Hero />

      <section className="section">
        <SectionHeader
          eyebrow="Editor's Choice"
          title="编辑推荐"
          actionLabel="全部游戏"
          actionHref="/games"
        />
        <div className="feature-grid">
          {GAMES.map((game, index) => (
            <FeatureCard key={game.id} game={game} index={index} />
          ))}
        </div>
      </section>

      {recentGames.length > 0 ? (
        <section className="section">
          <SectionHeader
            eyebrow="Continue Playing"
            title="接着玩上次的"
            actionLabel="全部游戏"
            actionHref="/games"
          />
          <div className="stack-card">
            {recentGames.map((game) => (
              <GameRow key={game.id} game={game} />
            ))}
          </div>
        </section>
      ) : null}

      <section className="section">
        <SectionHeader eyebrow="New This Week" title="本周新游" />
        <div className="stack-card">
          {GAMES.map((game) => (
            <GameRow key={game.id} game={game} />
          ))}
        </div>
      </section>

      <section className="section">
        <SectionHeader
          eyebrow="Browse by Category"
          title="按分区逛逛"
          actionLabel="全部分区"
          actionHref="/games"
        />
        <div className="category-grid">
          {CATEGORIES.map((category) => (
            <CategoryCard key={category.slug} category={category} />
          ))}
        </div>
      </section>

      <section className="section">
        <SectionHeader
          eyebrow="Top Charts"
          title="榜单速览"
          actionLabel="完整榜单"
          actionHref="/charts"
        />
        <div className="chart-preview">
          <div className="chart-preview__heading">
            <span className="chart-preview__heading-left">
              <TrophyIcon size={18} /> 免费游戏榜
            </span>
            <span className="chart-preview__heading-right">示例榜单</span>
          </div>
          {[...GAMES]
            .sort((a, b) => b.ratingCount - a.ratingCount)
            .map((game, index) => (
              <ChartPreviewRow key={game.id} game={game} rank={index + 1} />
            ))}
        </div>
      </section>

      <section className="section">
        <div className="editorial-card">
          <span className="editorial-card__icon">
            <SparkIcon size={26} />
          </span>
          <div>
            <p className="eyebrow">关于这个平台</p>
            <h2>小游戏，也值得被好好陈列。</h2>
            <p>
              小玩商店想做的事很简单：挑出那些规则轻、上手快、几分钟就能获得乐趣的小游戏，
              用舒服的方式摆在你面前。没有下载等待，没有注册流程，点开就能玩。
            </p>
            <a className="text-link" href={href('/about')}>
              了解小玩商店
              <ArrowRightIcon size={15} />
            </a>
          </div>
        </div>
      </section>
    </main>
  )
}

export function AboutPage() {
  return (
    <main id="main" className="page page--narrow">
      <PageIntro
        eyebrow="About MiniPlay"
        title="把轻巧的快乐，放在手边"
        description="小玩商店是一个专注于轻量小游戏的陈列空间。首期我们带来两款作品，它们都很小，却足够让人安静地玩上一会儿。"
      />
      <div className="about-grid">
        <section className="panel">
          <h2>我们挑选游戏的标准</h2>
          <div className="about-list">
            <div>
              <span className="about-list__number">01</span>
              <div>
                <h3>规则一眼能懂</h3>
                <p>不需要教程，不需要看攻略。打开的前五秒就知道该按哪里。</p>
              </div>
            </div>
            <div>
              <span className="about-list__number">02</span>
              <div>
                <h3>随时能停，也随时想再来</h3>
                <p>一局几分钟，没有每日任务和签到。玩得开心比留下来更重要。</p>
              </div>
            </div>
            <div>
              <span className="about-list__number">03</span>
              <div>
                <h3>在浏览器里直接玩</h3>
                <p>不用下载安装包，不必注册账号。你的收藏和最高分只保存在本机。</p>
              </div>
            </div>
          </div>
        </section>
        <section className="panel panel--tinted">
          <h2>这只是一个开始</h2>
          <p className="about-copy">
            冷启动的两款游戏是《2048》和《霓虹贪吃蛇》。它们足够经典，也足够适合被重新画一遍。
            接下来，我们会继续补上更多分区和作品。如果你在游戏里遇到问题，或者有想推荐的小游戏，
            欢迎在仓库的 Issue 里告诉我们。
          </p>
          <div className="about-stats">
            <div>
              <strong>2</strong>
              <span>款首发游戏</span>
            </div>
            <div>
              <strong>4</strong>
              <span>个游戏分区</span>
            </div>
            <div>
              <strong>0</strong>
              <span>次下载等待</span>
            </div>
          </div>
          <a className="button button--primary" href={href('/games')}>
            去逛逛游戏
            <ArrowRightIcon size={15} />
          </a>
        </section>
      </div>
      <section className="section">
        <SectionHeader title="首发阵容" eyebrow="Line-up" />
        <div className="stack-card">
          {GAMES.map((game) => (
            <GameRow key={game.id} game={game} />
          ))}
        </div>
      </section>
    </main>
  )
}

export function NotFoundPage() {
  return (
    <main id="main" className="page page--narrow">
      <div className="not-found">
        <p className="eyebrow">404</p>
        <h1>这个页面不在地图上</h1>
        <p>可能是链接过期了，也可能它还在开发者的草稿里。</p>
        <a className="button button--primary" href={href('/')}>
          回到 Today
        </a>
      </div>
    </main>
  )
}
