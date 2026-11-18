import { useCallback, useEffect, useRef, useState } from 'react'
import { useLibrary } from '../../context/LibraryContext'
import { useSwipe } from '../../hooks/useHashRoute'
import {
  FOOD_SCORE,
  GRID_SIZE,
  createInitialState,
  speedForScore,
  step,
  turn,
  type Direction,
  type SnakeState,
} from './logic'
import { PauseIcon, PlayGlyph, RestartIcon } from '../../components/Icons'

type PlayStatus = 'idle' | 'running' | 'paused' | 'over'

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

const CANVAS_SIZE = 600

function drawScene(canvas: HTMLCanvasElement, state: SnakeState): void {
  const context = canvas.getContext('2d')
  if (!context) return
  const ratio = Math.min(window.devicePixelRatio || 1, 2)
  const target = CANVAS_SIZE * ratio
  if (canvas.width !== target || canvas.height !== target) {
    canvas.width = target
    canvas.height = target
  }
  context.setTransform(ratio, 0, 0, ratio, 0, 0)
  context.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE)

  const background = context.createLinearGradient(0, 0, CANVAS_SIZE, CANVAS_SIZE)
  background.addColorStop(0, '#0b1220')
  background.addColorStop(1, '#10222b')
  context.fillStyle = background
  context.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE)

  const cell = CANVAS_SIZE / GRID_SIZE

  context.strokeStyle = 'rgba(148, 233, 255, 0.07)'
  context.lineWidth = 1
  for (let index = 1; index < GRID_SIZE; index += 1) {
    const position = index * cell + 0.5
    context.beginPath()
    context.moveTo(position, 0)
    context.lineTo(position, CANVAS_SIZE)
    context.stroke()
    context.beginPath()
    context.moveTo(0, position)
    context.lineTo(CANVAS_SIZE, position)
    context.stroke()
  }

  if (state.food.x >= 0) {
    const foodX = (state.food.x + 0.5) * cell
    const foodY = (state.food.y + 0.5) * cell
    const glow = context.createRadialGradient(foodX, foodY, 0, foodX, foodY, cell * 1.6)
    glow.addColorStop(0, 'rgba(251, 113, 133, 0.55)')
    glow.addColorStop(1, 'rgba(251, 113, 133, 0)')
    context.fillStyle = glow
    context.beginPath()
    context.arc(foodX, foodY, cell * 1.6, 0, Math.PI * 2)
    context.fill()

    context.fillStyle = '#fb7185'
    context.beginPath()
    context.arc(foodX, foodY, cell * 0.27, 0, Math.PI * 2)
    context.fill()
    context.fillStyle = 'rgba(255, 255, 255, 0.75)'
    context.beginPath()
    context.arc(foodX - cell * 0.08, foodY - cell * 0.09, cell * 0.07, 0, Math.PI * 2)
    context.fill()
  }

  const segments = state.snake.length
  const inset = Math.max(2, cell * 0.08)
  for (let index = segments - 1; index >= 0; index -= 1) {
    const segment = state.snake[index]
    const progress = segments === 1 ? 0 : index / (segments - 1)
    const x = segment.x * cell + inset
    const y = segment.y * cell + inset
    const size = cell - inset * 2
    const lightness = 64 - progress * 26
    const hue = 160 + progress * 32
    context.fillStyle = `hsl(${hue} 82% ${lightness}%)`
    context.shadowColor = index === 0 ? 'rgba(110, 231, 183, 0.5)' : 'transparent'
    context.shadowBlur = index === 0 ? cell * 0.6 : 0
    context.beginPath()
    context.roundRect(x, y, size, size, Math.max(3, cell * 0.24))
    context.fill()
    context.shadowBlur = 0
  }

  const head = state.snake[0]
  if (head) {
    const headX = (head.x + 0.5) * cell
    const headY = (head.y + 0.5) * cell
    const vector =
      state.direction === 'up'
        ? { x: 0, y: -1 }
        : state.direction === 'down'
          ? { x: 0, y: 1 }
          : state.direction === 'left'
            ? { x: -1, y: 0 }
            : { x: 1, y: 0 }
    const perpendicular = { x: -vector.y, y: vector.x }
    for (const side of [-1, 1]) {
      const eyeX = headX + vector.x * cell * 0.18 + perpendicular.x * cell * 0.17 * side
      const eyeY = headY + vector.y * cell * 0.18 + perpendicular.y * cell * 0.17 * side
      context.fillStyle = '#0b1220'
      context.beginPath()
      context.arc(eyeX, eyeY, cell * 0.085, 0, Math.PI * 2)
      context.fill()
      context.fillStyle = 'rgba(209, 250, 229, 0.9)'
      context.beginPath()
      context.arc(eyeX - cell * 0.02, eyeY - cell * 0.025, cell * 0.03, 0, Math.PI * 2)
      context.fill()
    }
  }
}

function speedLabel(score: number): string {
  const base = speedForScore(0)
  const current = speedForScore(score)
  return `${(base / current).toFixed(1)}×`
}

export function GameSnake() {
  const { best, recordScore } = useLibrary()
  const bestScore = best['snake'] ?? 0
  const [state, setState] = useState<SnakeState>(() => createInitialState())
  const [status, setStatus] = useState<PlayStatus>('idle')
  const [announcement, setAnnouncement] = useState('点击开始按钮，或按空格键开始。')
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (canvasRef.current) drawScene(canvasRef.current, state)
  }, [state])

  useEffect(() => {
    if (state.score > 0) recordScore('snake', state.score)
  }, [state.score, recordScore])

  useEffect(() => {
    if (status === 'running' && !state.alive) {
      setStatus('over')
      setAnnouncement(`撞到了，本局得分 ${state.score}。`)
    }
  }, [state.alive, state.score, status])

  useEffect(() => {
    if (status !== 'running') return
    const interval = window.setInterval(() => {
      setState((current) => {
        const next = step(current)
        return next
      })
    }, speedForScore(state.score))
    return () => window.clearInterval(interval)
  }, [status, state.score])

  const startGame = useCallback(() => {
    const next = createInitialState()
    setState(next)
    setStatus('running')
    setAnnouncement('游戏开始，吃掉发光果实。')
  }, [])

  const togglePause = useCallback(() => {
    setStatus((current) => {
      if (current === 'running') return 'paused'
      if (current === 'paused') return 'running'
      return current
    })
  }, [])

  const steer = useCallback((direction: Direction) => {
    setState((current) => turn(current, direction))
  }, [])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null
      if (target && ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)) return

      if (event.code === 'Space' || event.key === ' ') {
        event.preventDefault()
        if (status === 'running' || status === 'paused') togglePause()
        else startGame()
        return
      }

      const direction = KEY_MAP[event.key.toLowerCase()]
      if (!direction) return
      event.preventDefault()
      if (status === 'running') steer(direction)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [startGame, status, steer, togglePause])

  useEffect(() => {
    const onVisibilityChange = () => {
      if (document.hidden) {
        setStatus((current) => (current === 'running' ? 'paused' : current))
      }
    }
    document.addEventListener('visibilitychange', onVisibilityChange)
    return () => document.removeEventListener('visibilitychange', onVisibilityChange)
  }, [])

  useEffect(() => {
    if (status === 'paused') setAnnouncement('已暂停，按空格或点击继续。')
  }, [status])

  const swipe = useSwipe((direction) => {
    if (status === 'running') steer(direction)
  }, status === 'running')

  const restart = () => {
    startGame()
  }

  return (
    <section className="game-snake" aria-label="霓虹贪吃蛇游戏">
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
          <span>速度</span>
          <strong>{speedLabel(state.score)}</strong>
        </div>
        <div className="game-hud__actions">
          <button
            type="button"
            className="game-action"
            onClick={status === 'running' || status === 'paused' ? togglePause : startGame}
            aria-label={status === 'paused' ? '继续游戏' : '暂停游戏'}
          >
            {status === 'running' ? <PauseIcon size={16} /> : <PlayGlyph size={14} />}
            {status === 'running' ? '暂停' : status === 'paused' ? '继续' : '开始'}
          </button>
          <button type="button" className="game-action" onClick={restart}>
            <RestartIcon size={16} />
            重开
          </button>
        </div>
      </div>

      <div className={`board-snake ${status === 'paused' ? 'is-paused' : ''}`} {...swipe}>
        <canvas ref={canvasRef} className="board-snake__canvas" aria-label="贪吃蛇游戏画面" />
        <div className="board-snake__frame" aria-hidden />

        {status !== 'running' ? (
          <div className="game-overlay game-overlay--snake" role="dialog" aria-modal="true" aria-labelledby="snake-overlay-title">
            <div className="game-overlay__card game-overlay__card--dark">
              <p className="eyebrow">{status === 'over' ? 'Game Over' : status === 'paused' ? 'Paused' : 'Ready'}</p>
              <h2 id="snake-overlay-title">
                {status === 'over' ? '撞到了' : status === 'paused' ? '已暂停' : '准备好了吗？'}
              </h2>
              <p className="game-overlay__summary">
                {status === 'over' ? (
                  <>
                    本局得分 <strong>{state.score}</strong>
                    <span> · </span>
                    最高分 <strong>{Math.max(bestScore, state.score)}</strong>
                  </>
                ) : (
                  '吃掉发光果实，让小蛇越来越长。别撞到墙，也别撞到自己。'
                )}
              </p>
              <div className="game-overlay__actions">
                <button
                  type="button"
                  className="button button--light"
                  onClick={status === 'paused' ? togglePause : startGame}
                >
                  <PlayGlyph size={14} />
                  {status === 'paused' ? '继续游戏' : status === 'over' ? '再来一局' : '开始游戏'}
                </button>
                {status !== 'idle' ? (
                  <button type="button" className="button button--glass" onClick={startGame}>
                    重新开始
                  </button>
                ) : null}
              </div>
              <p className="game-overlay__hint">空格暂停 · 方向键转向 · 手机可用下方按键</p>
            </div>
          </div>
        ) : null}
      </div>

      <div className="snake-dpad" role="group" aria-label="方向控制">
        <button type="button" className="snake-dpad__button snake-dpad__button--up" onClick={() => steer('up')} aria-label="向上">
          ↑
        </button>
        <button type="button" className="snake-dpad__button snake-dpad__button--left" onClick={() => steer('left')} aria-label="向左">
          ←
        </button>
        <button type="button" className="snake-dpad__button snake-dpad__button--right" onClick={() => steer('right')} aria-label="向右">
          →
        </button>
        <button type="button" className="snake-dpad__button snake-dpad__button--down" onClick={() => steer('down')} aria-label="向下">
          ↓
        </button>
      </div>

      <p className="game-hint">
        方向键 / WASD 控制方向，空格暂停。每吃掉一个果实得 {FOOD_SCORE} 分，速度会慢慢变快。
      </p>
      <p className="sr-only" aria-live="polite">
        {announcement}
      </p>
    </section>
  )
}
