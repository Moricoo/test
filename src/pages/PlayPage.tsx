import { useEffect } from 'react'
import { getGame } from '../data/catalog'
import { href } from '../hooks/useHashRoute'
import { useLibrary } from '../context/LibraryContext'
import { GameIcon } from '../components/GameArt'
import { Game2048 } from '../games/game2048/Game2048'
import { GameSnake } from '../games/snake/GameSnake'
import { ChevronLeftIcon, PlayGlyph } from '../components/Icons'

const GAME_LABELS: Record<string, { number: string; tag: string }> = {
  '2048': { number: '01', tag: '数字合并 · 益智' },
  snake: { number: '02', tag: '街机 · 反应' },
}

export function PlayPage({ gameId }: { gameId: string }) {
  const game = getGame(gameId)
  const { markPlayed } = useLibrary()

  useEffect(() => {
    if (game) markPlayed(game.id)
  }, [game, markPlayed])

  if (!game) {
    return (
      <main className="play-page play-page--missing">
        <div className="not-found">
          <p className="eyebrow">游戏不存在</p>
          <h1>没有找到这款游戏</h1>
          <p>回到商店看看已经上架的作品吧。</p>
          <a className="button button--primary" href={href('/games')}>
            <PlayGlyph size={14} />
            浏览全部游戏
          </a>
        </div>
      </main>
    )
  }

  const label = GAME_LABELS[game.id] ?? { number: '—', tag: '小游戏' }

  const goBack = () => {
    if (window.history.length > 1) window.history.back()
    else window.location.hash = `/game/${game.id}`
  }

  return (
    <main className={`play-page play-page--${game.art}`}>
      <header className="play-header">
        <button type="button" className="play-header__back" onClick={goBack}>
          <ChevronLeftIcon size={19} />
          <span>商店</span>
        </button>
        <div className="play-header__identity">
          <GameIcon game={game} size={38} />
          <div>
            <p className="play-header__title">{game.name}</p>
            <p className="play-header__sub">
              {label.number} · {label.tag}
            </p>
          </div>
        </div>
        <a className="play-header__detail" href={href(`/game/${game.id}`)}>
          游戏详情
        </a>
      </header>

      <div className="play-stage">
        {game.art === '2048' ? <Game2048 /> : <GameSnake />}
      </div>

      <footer className="play-footer">
        <span>小玩商店 · {game.name}</span>
        <span>进度仅保存在本机</span>
      </footer>
    </main>
  )
}
