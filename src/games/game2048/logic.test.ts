import { describe, expect, it } from 'vitest'
import {
  applyMove,
  addRandomTile,
  boardsEqual,
  canMove,
  createEmptyBoard,
  createInitialBoard,
  emptyCells,
  hasWon,
  highestTile,
  move,
  slideRowLeft,
  type Board,
} from './logic'

function board(rows: number[][]): Board {
  return rows.map((row) => [...row])
}

describe('slideRowLeft', () => {
  it('merges a pair once and counts the score', () => {
    const result = slideRowLeft([2, 2, 4, 4])
    expect(result.row).toEqual([4, 8, 0, 0])
    expect(result.gained).toBe(12)
  })

  it('merges only once per tile', () => {
    expect(slideRowLeft([2, 2, 2, 2]).row).toEqual([4, 4, 0, 0])
    expect(slideRowLeft([4, 4, 8, 0]).row).toEqual([8, 8, 0, 0])
    expect(slideRowLeft([2, 0, 2, 4]).row).toEqual([4, 4, 0, 0])
  })

  it('pads rows back to four cells', () => {
    expect(slideRowLeft([0, 0, 0, 2]).row).toEqual([2, 0, 0, 0])
    expect(slideRowLeft([0, 0, 0, 0]).gained).toBe(0)
  })
})

describe('move', () => {
  const start = board([
    [2, 2, 4, 0],
    [0, 0, 0, 0],
    [2, 2, 2, 2],
    [4, 0, 4, 8],
  ])

  it('moves left and merges', () => {
    const result = move(start, 'left')
    expect(result.board).toEqual([
      [4, 4, 0, 0],
      [0, 0, 0, 0],
      [4, 4, 0, 0],
      [8, 8, 0, 0],
    ])
    expect(result.gained).toBe(4 + 8 + 8)
    expect(result.moved).toBe(true)
  })

  it('moves right and merges toward the right edge', () => {
    const result = move(start, 'right')
    expect(result.board).toEqual([
      [0, 0, 4, 4],
      [0, 0, 0, 0],
      [0, 0, 4, 4],
      [0, 0, 8, 8],
    ])
    expect(result.gained).toBe(20)
  })

  it('moves up along columns', () => {
    const vertical = board([
      [2, 0, 0, 2],
      [2, 0, 0, 2],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ])
    expect(move(vertical, 'up').board).toEqual([
      [4, 0, 0, 4],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ])
  })

  it('moves down along columns', () => {
    const vertical = board([
      [2, 0, 4, 0],
      [2, 0, 4, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ])
    expect(move(vertical, 'down').board).toEqual([
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [4, 0, 8, 0],
    ])
  })

  it('reports no movement when nothing can shift', () => {
    const full = board([
      [2, 4, 2, 4],
      [4, 2, 4, 2],
      [2, 4, 2, 4],
      [4, 2, 4, 2],
    ])
    const result = move(full, 'left')
    expect(result.moved).toBe(false)
    expect(result.gained).toBe(0)
    expect(boardsEqual(result.board, full)).toBe(true)
  })
})

describe('tiles and state', () => {
  it('starts with exactly two tiles', () => {
    const initial = createInitialBoard(() => 0)
    expect(initial.flat().filter((value) => value !== 0)).toHaveLength(2)
    expect(initial[0][0]).toBe(2)
    expect(initial[0][1]).toBe(2)
  })

  it('adds a tile only to an empty cell', () => {
    const initial = createEmptyBoard()
    const randomValues = [0, 0.95]
    const next = addRandomTile(initial, () => randomValues.shift() ?? 0)
    expect(emptyCells(next)).toHaveLength(15)
    expect(next[0][0]).toBe(4)
  })

  it('does not add a tile to a full board', () => {
    const full = board([
      [2, 4, 2, 4],
      [4, 2, 4, 2],
      [2, 4, 2, 4],
      [4, 2, 4, 2],
    ])
    expect(addRandomTile(full)).toBe(full)
  })

  it('detects wins and movable boards', () => {
    expect(hasWon(board([[2048, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]]))).toBe(true)
    expect(hasWon(createEmptyBoard())).toBe(false)
    expect(canMove(createEmptyBoard())).toBe(true)
    expect(highestTile(board([[2, 8], [0, 16], [0, 0], [0, 0]]))).toBe(16)
  })

  it('declares game over only when the board is full and locked', () => {
    const locked = board([
      [2, 4, 2, 4],
      [4, 2, 4, 2],
      [2, 4, 2, 4],
      [4, 2, 4, 2],
    ])
    expect(canMove(locked)).toBe(false)
    const state = { board: locked, score: 0, status: 'playing' as const }
    expect(applyMove(state, 'left').status).toBe('playing')
    expect(applyMove(state, 'left').board).toBe(locked)
  })

  it('adds score and spawns a tile after a successful move', () => {
    const start = board([
      [2, 2, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ])
    const result = applyMove(
      { board: start, score: 10, status: 'playing' },
      'left',
      { random: () => 0 },
    )
    expect(result.score).toBe(14)
    expect(result.status).toBe('playing')
    expect(result.board.flat().filter((value) => value !== 0)).toHaveLength(2)
  })
})
