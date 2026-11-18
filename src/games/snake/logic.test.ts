import { describe, expect, it } from 'vitest'
import {
  FOOD_SCORE,
  GRID_SIZE,
  MIN_SPEED_MS,
  START_SPEED_MS,
  createInitialState,
  placeFood,
  samePoint,
  speedForScore,
  step,
  turn,
  type Point,
  type SnakeState,
} from './logic'

function state(overrides: Partial<SnakeState>): SnakeState {
  return {
    snake: [
      { x: 5, y: 5 },
      { x: 4, y: 5 },
      { x: 3, y: 5 },
    ],
    direction: 'right',
    food: { x: 10, y: 10 },
    score: 0,
    alive: true,
    ...overrides,
  }
}

describe('createInitialState', () => {
  it('starts with a short snake and food that is not on it', () => {
    const initial = createInitialState(() => 0)
    expect(initial.snake).toHaveLength(3)
    expect(initial.direction).toBe('right')
    expect(initial.score).toBe(0)
    expect(initial.alive).toBe(true)
    expect(initial.snake.some((segment) => samePoint(segment, initial.food))).toBe(false)
  })
})

describe('turn', () => {
  it('accepts perpendicular turns', () => {
    expect(turn(state({}), 'up').direction).toBe('up')
    expect(turn(state({}), 'down').direction).toBe('down')
  })

  it('ignores reversals and repeats', () => {
    expect(turn(state({}), 'left').direction).toBe('right')
    expect(turn(state({}), 'right').direction).toBe('right')
  })

  it('ignores turns once the snake is dead', () => {
    expect(turn(state({ alive: false }), 'up').direction).toBe('right')
  })

  it('does not allow two quick turns to reverse into the neck', () => {
    const upward = turn(state({}), 'up')
    expect(upward.direction).toBe('up')
    const folded = turn(upward, 'left')
    expect(folded.direction).toBe('up')
  })
})

describe('step', () => {
  it('moves the head and keeps the body length without food', () => {
    const next = step(state({}))
    expect(next.alive).toBe(true)
    expect(next.snake[0]).toEqual({ x: 6, y: 5 })
    expect(next.snake).toHaveLength(3)
    expect(next.score).toBe(0)
  })

  it('eats food, grows and scores', () => {
    const food: Point = { x: 6, y: 5 }
    const next = step(state({ food }), () => 0)
    expect(next.alive).toBe(true)
    expect(next.snake).toHaveLength(4)
    expect(next.score).toBe(FOOD_SCORE)
    expect(next.food).not.toEqual(food)
    expect(next.snake.some((segment) => samePoint(segment, next.food))).toBe(false)
  })

  it('dies when hitting a wall', () => {
    const next = step(
      state({
        snake: [
          { x: GRID_SIZE - 1, y: 4 },
          { x: GRID_SIZE - 2, y: 4 },
        ],
      }),
    )
    expect(next.alive).toBe(false)
    expect(next.snake[0]).toEqual({ x: GRID_SIZE - 1, y: 4 })
  })

  it('dies when running into its own body', () => {
    const next = step(
      state({
        snake: [
          { x: 5, y: 5 },
          { x: 6, y: 5 },
          { x: 6, y: 6 },
          { x: 5, y: 6 },
          { x: 4, y: 6 },
        ],
        direction: 'down',
        food: { x: 0, y: 0 },
      }),
    )
    expect(next.alive).toBe(false)
  })

  it('allows moving into the cell the tail is leaving', () => {
    const next = step(
      state({
        snake: [
          { x: 6, y: 4 },
          { x: 6, y: 5 },
          { x: 5, y: 5 },
          { x: 5, y: 4 },
        ],
        direction: 'left',
        food: { x: 0, y: 0 },
      }),
    )
    expect(next.alive).toBe(true)
    expect(next.snake[0]).toEqual({ x: 5, y: 4 })
    expect(next.snake).toHaveLength(4)
  })

  it('does not keep stepping once dead', () => {
    const dead = state({ alive: false })
    expect(step(dead)).toBe(dead)
  })
})

describe('placeFood', () => {
  it('never places food on the snake', () => {
    const snake = [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 }]
    const food = placeFood(snake, () => 0.999)
    expect(snake.some((segment) => samePoint(segment, food))).toBe(false)
  })

  it('returns a sentinel when the board is full', () => {
    const snake: Point[] = []
    for (let y = 0; y < GRID_SIZE; y += 1) {
      for (let x = 0; x < GRID_SIZE; x += 1) snake.push({ x, y })
    }
    expect(placeFood(snake)).toEqual({ x: -1, y: -1 })
  })
})

describe('speedForScore', () => {
  it('starts at the base speed and accelerates with a floor', () => {
    expect(speedForScore(0)).toBe(START_SPEED_MS)
    expect(speedForScore(40)).toBe(START_SPEED_MS)
    expect(speedForScore(50)).toBe(START_SPEED_MS - 8)
    expect(speedForScore(10_000)).toBe(MIN_SPEED_MS)
  })
})
