export const GRID_SIZE = 20
export const FOOD_SCORE = 10
export const START_SPEED_MS = 150
export const MIN_SPEED_MS = 72

export type Point = { x: number; y: number }
export type Direction = 'up' | 'down' | 'left' | 'right'
export type Random = () => number

export interface SnakeState {
  snake: Point[]
  direction: Direction
  food: Point
  score: number
  alive: boolean
}

const VECTORS: Record<Direction, Point> = {
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
}

const OPPOSITE: Record<Direction, Direction> = {
  up: 'down',
  down: 'up',
  left: 'right',
  right: 'left',
}

export function samePoint(a: Point, b: Point): boolean {
  return a.x === b.x && a.y === b.y
}

export function placeFood(snake: Point[], random: Random = Math.random): Point {
  const occupied = new Set(snake.map((segment) => `${segment.x},${segment.y}`))
  const free: Point[] = []
  for (let y = 0; y < GRID_SIZE; y += 1) {
    for (let x = 0; x < GRID_SIZE; x += 1) {
      if (!occupied.has(`${x},${y}`)) free.push({ x, y })
    }
  }
  if (free.length === 0) return { x: -1, y: -1 }
  const index = Math.min(free.length - 1, Math.floor(random() * free.length))
  return free[index]
}

export function createInitialSnake(): Point[] {
  const middle = Math.floor(GRID_SIZE / 2)
  return [
    { x: middle, y: middle },
    { x: middle - 1, y: middle },
    { x: middle - 2, y: middle },
  ]
}

export function createInitialState(random: Random = Math.random): SnakeState {
  const snake = createInitialSnake()
  return {
    snake,
    direction: 'right',
    food: placeFood(snake, random),
    score: 0,
    alive: true,
  }
}

/** Ignores reversals and no-op turns so the snake never runs into itself by accident. */
export function turn(state: SnakeState, direction: Direction): SnakeState {
  if (!state.alive) return state
  if (direction === state.direction) return state
  if (direction === OPPOSITE[state.direction]) return state

  // A second turn can land before the next tick; compare against the neck so
  // two quick turns cannot fold the snake back into its own body.
  const [head, neck] = state.snake
  if (neck) {
    const vector = VECTORS[direction]
    if (vector.x === neck.x - head.x && vector.y === neck.y - head.y) return state
  }
  return { ...state, direction }
}

export function isInside(point: Point): boolean {
  return point.x >= 0 && point.y >= 0 && point.x < GRID_SIZE && point.y < GRID_SIZE
}

export function step(state: SnakeState, random: Random = Math.random): SnakeState {
  if (!state.alive) return state
  const vector = VECTORS[state.direction]
  const head = {
    x: state.snake[0].x + vector.x,
    y: state.snake[0].y + vector.y,
  }
  if (!isInside(head)) return { ...state, alive: false }

  const eating = samePoint(head, state.food)
  // The tail cell becomes free on the same tick, so entering it is legal.
  const body = eating ? state.snake : state.snake.slice(0, -1)
  if (body.some((segment) => samePoint(segment, head))) {
    return { ...state, alive: false }
  }

  const snake = eating
    ? [head, ...state.snake]
    : [head, ...state.snake.slice(0, -1)]
  const score = state.score + (eating ? FOOD_SCORE : 0)
  return {
    snake,
    direction: state.direction,
    food: eating ? placeFood(snake, random) : state.food,
    score,
    alive: true,
  }
}

/** Speeds up every five foods, with a floor so the board stays playable. */
export function speedForScore(score: number): number {
  const foodsEaten = Math.floor(score / FOOD_SCORE)
  return Math.max(MIN_SPEED_MS, START_SPEED_MS - Math.floor(foodsEaten / 5) * 8)
}
