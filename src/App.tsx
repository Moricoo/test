import { useEffect } from 'react'
import { LibraryProvider } from './context/LibraryContext'
import { getGame } from './data/catalog'
import { useRoute, useScrollReset } from './hooks/useHashRoute'
import {
  BottomTabBar,
  SiteFooter,
  SiteHeader,
} from './components/Chrome'
import { AboutPage, NotFoundPage, TodayPage } from './pages/TodayPage'
import { CategoryPage, GamesPage } from './pages/GamesPage'
import { ChartsPage, SearchPage } from './pages/ChartsSearchPages'
import { GameDetailPage } from './pages/GameDetailPage'
import { PlayPage } from './pages/PlayPage'

const TITLES: Record<string, string> = {
  '/': 'Today · 小玩商店 MiniPlay',
  '/games': '游戏 · 小玩商店 MiniPlay',
  '/charts': '排行榜 · 小玩商店 MiniPlay',
  '/search': '搜索 · 小玩商店 MiniPlay',
  '/about': '关于 · 小玩商店 MiniPlay',
}

function Routes({ path, query }: { path: string; query: URLSearchParams }) {
  const segments = path.split('/').filter(Boolean)
  const section = segments[0]

  switch (section) {
    case undefined:
      return <TodayPage />
    case 'games':
      return <GamesPage />
    case 'charts':
      return <ChartsPage />
    case 'search':
      return <SearchPage initialQuery={query.get('q') ?? ''} />
    case 'category':
      return <CategoryPage slug={segments[1] ?? ''} />
    case 'game':
      return <GameDetailPage gameId={segments[1] ?? ''} />
    case 'play':
      return <PlayPage gameId={segments[1] ?? ''} />
    case 'about':
      return <AboutPage />
    default:
      return <NotFoundPage />
  }
}

export default function App() {
  const route = useRoute()
  const immersive = route.path.startsWith('/play/')
  useScrollReset(route.path)

  useEffect(() => {
    const base = TITLES[route.path]
    if (base) {
      document.title = base
      return
    }
    if (route.path.startsWith('/play/')) {
      const id = route.path.split('/')[2] ?? ''
      const game = getGame(id)
      document.title = `正在游玩 ${game?.name ?? id} · 小玩商店`
      return
    }
    if (route.path.startsWith('/game/')) {
      document.title = '游戏详情 · 小玩商店 MiniPlay'
      return
    }
    if (route.path.startsWith('/category/')) {
      document.title = '分区 · 小玩商店 MiniPlay'
      return
    }
    document.title = '小玩商店 MiniPlay'
  }, [route.path])

  return (
    <LibraryProvider>
      <a
        className="skip-link"
        href="#main"
        onClick={(event) => {
          event.preventDefault()
          const main = document.querySelector<HTMLElement>('main')
          if (!main) return
          main.tabIndex = -1
          main.focus({ preventScroll: true })
          main.scrollIntoView({ block: 'start' })
        }}
      >
        跳到主要内容
      </a>
      {immersive ? (
        <div className="route-view" key={route.path}>
          <Routes path={route.path} query={route.query} />
        </div>
      ) : (
        <div className="app-shell">
          <SiteHeader path={route.path} />
          <div className="app-main">
            <div className="route-view" key={route.path}>
              <Routes path={route.path} query={route.query} />
            </div>
          </div>
          <SiteFooter />
          <BottomTabBar path={route.path} />
        </div>
      )}
    </LibraryProvider>
  )
}
