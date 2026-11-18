import { useCallback, useEffect, useRef, useState } from 'react'
import { useLibrary } from '../../context/LibraryContext'
import { useSwipe } from '../../hooks/useHashRoute'
import {
  applyMove,
  createInitialBoard,
  highestTile,
  type Board,
  type Direction,
  type GameState,
} from './logic'
import { RestartIcon, UndoIcon } from '../../components/Icons'

interface Snapshot {
  board: Board
  score: number
}

const KEY_MAP: Record<string, Direction> = {
  arrowup: 'up',
  arrowdown: 'down',
  arrowleft: 'left',
  arrowright: 'right',
  w: 'up',
  s: 'down',
  a: 'left',
  d: 'right',
}

export function Game2048() {
  const { best, recordScore } = useLibrary()
  const bestScore = best['2048'] ?? 0

  const [state, setState] = useState<GameState>(() => ({
    board: createInitialBoard(),
    score: 0,
    status: 'playing',
  }))
  const stateRef = useRef(state)
  const [history, setHistory] = useState<Snapshot[]>([])
  const historyRef = useRef<Snapshot[]>([])
  const [keepPlaying, setKeepPlaying] = useState(false)
  const [moves, setMoves] = useState(0)
  const [announcement, setAnnouncement] = useState('新的一局开始了，使用方向键或滑动棋盘。')

  useEffect(() => {
    stateRef.current = state
  }, [state])

  useEffect(() => {
    if (state.score > 0) recordScore('2048', state.score)
  }, [state.score, recordScore])

  const gameOver = state.status === 'over'

  const performMove = useCallback(
    (direction: Direction) => {
      const current = stateRef.current
      if (current.status === 'over' || current.status === 'won') return
      const next = applyMove(current, direction, { continueAfterWin: keepPlaying })
      if (next === current) return

      const entries = [...historyRef.current.slice(-9), { board: current.board, score: current.score }]
      historyRef.current = entries
      setHistory(entries)
      stateRef.current = next
      setState(next)
      setMoves((value) => value + 1)
      if (next.status === 'over') {
        setAnnouncement(`游戏结束，本局得分 ${next.score}。`)
      } else if (next.status === 'won') {
        setAnnouncement('你合出了 2048！可以继续挑战更大的数字。')
      } else if (next.score > current.score) {
        setAnnouncement(`合并成功，当前得分 ${next.score}。`)
      }
    },
    [keepPlaying],
  )

  const undo = useCallback(() => {
    const entries = historyRef.current
    const previous = entries.at(-1)
    if (!previous) return
    const next: GameState = {
      board: previous.board,
      score: previous.score,
      status: 'playing',
    }
    const remaining = entries.slice(0, -1)
    historyRef.current = remaining
    setHistory(remaining)
    stateRef.current = next
    setState(next)
    setMoves((value) => Math.max(0, value - 1))
    setAnnouncement('已撤销一步。')
  }, [])

  const newGame = useCallback(() => {
    const next: GameState = {
      board: createInitialBoard(),
      score: 0,
      status: 'playing',
    }
    stateRef.current = next
    setState(next)
    historyRef.current = []
    setHistory([])
    setMoves(0)
    setKeepPlaying(false)
    setAnnouncement('新的一局开始了。')
  }, [])

  const continueGame = useCallback(() => {
    setKeepPlaying(true)
    setState((current) => ({ ...current, status: 'playing' }))
    setAnnouncement('继续挑战更大的数字。')
  }, [])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null
      if (target && ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)) return
      const direction = KEY_MAP[event.key.toLowerCase()]
      if (!direction) return
      event.preventDefault()
      performMove(direction)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [performMove])

  const swipe = useSwipe(performMove, state.status === 'playing')
  const maxTile = highestTile(state.board)
  const canUndo = history.length > 0

  return (
    <section className="game-2048" aria-label="2048 游戏">
      <div className="game-hud">
        <div className="score-card">
          <span>得分</span>
          <strong>{state.score.toLocaleString('zh-CN')}</strong>
        </div>
        <div className="score-card">
          <span>最高分</span>
          <strong>{Math.max(bestScore, state.score).toLocaleString('zh-CN')}</strong>
        </div>
        <div className="score-card score-card--subtle">
          <span>最大方块</span>
          <strong>{maxTile || 2}</strong>
        </div>
        <div className="game-hud__actions">
          <button type="button" className="game-action" onClick={undo} disabled={!canUndo}>
            <UndoIcon size={16} />
            撤销
          </button>
          <button type="button" className="game-action" onClick={newGame}>
            <RestartIcon size={16} />
            新游戏
          </button>
        </div>
      </div>

      <div className={`board-2048 ${gameOver ? 'is-over' : ''}`}>
        <div className="board-2048__header">
          <span>目标 2048</span>
          <span>{moves} 步</span>
        </div>
        <div
          className="board-2048__surface"
          {...swipe}
          role="group"
          aria-label="2048 棋盘，使用方向键、WASD 或滑动操作"
        >
          <div className="board-2048__grid">
            {state.board.map((row, rowIndex) =>
              row.map((value, columnIndex) => (
                <div className="board-2048__cell" key={`${rowIndex}-${columnIndex}`}>
                  {value > 0 ? (
                    <span
                      key={`${rowIndex}-${columnIndex}-${value}`}
                      className="tile-2048"
                      data-value={value}
                    >
                      {value}
                    </span>
                  ) : null}
                </div>
              )),
            )}
          </div>

          {state.status !== 'playing' ? (
            <div className="game-overlay" role="dialog" aria-modal="true" aria-labelledby="game-2048-overlay-title">
              <div className="game-overlay__card">
                <p className="eyebrow">{state.status === 'won' ? 'You made it' : 'Game Over'}</p>
                <h2 id="game-2048-overlay-title">
                  {state.status === 'won' ? '合出 2048 了！' : '这局结束'}
                </h2>
                <p className="game-overlay__summary">
                  本局得分 <strong>{state.score.toLocaleString('zh-CN')}</strong>
                  <span> · </span>
                  最高分 <strong>{Math.max(bestScore, state.score).toLocaleString('zh-CN')}</strong>
                </p>
                <div className="game-overlay__actions">
                  {state.status === 'won' ? (
                    <>
                      <button type="button" className="button button--primary" onClick={continueGame}>
                        继续挑战
                      </button>
                      <button type="button" className="button button--secondary" onClick={newGame}>
                        新游戏
                      </button>
                    </>
                  ) : (
                    <>
                      <button type="button" className="button button--primary" onClick={newGame}>
                        再来一局
                      </button>
                      {canUndo ? (
                        <button type="button" className="button button--secondary" onClick={undo}>
                          撤销一步
                        </button>
                      ) : null}
                    </>
                  )}
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>

      <p className="game-hint">
        方向键 / WASD 移动，也可以直接滑动棋盘。合出相同数字即可翻倍。
      </p>
      <p className="sr-only" aria-live="polite">
        {announcement}
      </p>
    </section>
  )
}
