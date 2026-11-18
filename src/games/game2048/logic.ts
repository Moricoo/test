export const BOARD_SIZE = 4
export const WINNING_TILE = 2048

export type Board = number[][]
export type Direction = 'left' | 'right' | 'up' | 'down'

export interface MoveResult {
  board: Board
  gained: number
  moved: boolean
}

export interface GameState {
  board: Board
  score: number
  status: 'playing' | 'won' | 'over'
}

export type Random = () => number

export function createEmptyBoard(): Board {
  return Array.from({ length: BOARD_SIZE }, () =>
    Array.from({ length: BOARD_SIZE }, () => 0),
  )
}

export function cloneBoard(board: Board): Board {
  return board.map((row) => [...row])
}

/** Slides a single row toward the left, merging equal neighbours once. */
export function slideRowLeft(row: readonly number[]): { row: number[]; gained: number } {
  const values = row.filter((value) => value !== 0)
  const result: number[] = []
  let gained = 0
  let index = 0
  while (index < values.length) {
    const current = values[index]
    const next = values[index + 1]
    if (next !== undefined && next === current) {
      const merged = current * 2
      result.push(merged)
      gained += merged
      index += 2
    } else {
      result.push(current)
      index += 1
    }
  }
  while (result.length < BOARD_SIZE) result.push(0)
  return { row: result, gained }
}

function transpose(board: Board): Board {
  return board[0].map((_, column) => board.map((row) => row[column]))
}

function reverseRows(board: Board): Board {
  return board.map((row) => [...row].reverse())
}

/** Expresses the requested direction as a leftward slide on a rotated board. */
function transformFor(direction: Direction, board: Board): Board {
  switch (direction) {
    case 'left':
      return cloneBoard(board)
    case 'right':
      return reverseRows(board)
    case 'up':
      return transpose(board)
    case 'down':
      return reverseRows(transpose(board))
  }
}

function inverseTransform(direction: Direction, board: Board): Board {
  switch (direction) {
    case 'left':
      return board
    case 'right':
      return reverseRows(board)
    case 'up':
      return transpose(board)
    case 'down':
      return transpose(reverseRows(board))
  }
}

export function boardsEqual(a: Board, b: Board): boolean {
  return a.every((row, r) => row.every((value, c) => value === b[r][c]))
}

export function move(board: Board, direction: Direction): MoveResult {
  const transformed = transformFor(direction, board)
  let gained = 0
  const slid = transformed.map((row) => {
    const result = slideRowLeft(row)
    gained += result.gained
    return result.row
  })
  const next = inverseTransform(direction, slid)
  return {
    board: next,
    gained,
    moved: !boardsEqual(board, next),
  }
}

export function emptyCells(board: Board): Array<{ row: number; column: number }> {
  const cells: Array<{ row: number; column: number }> = []
  board.forEach((row, rowIndex) => {
    row.forEach((value, columnIndex) => {
      if (value === 0) cells.push({ row: rowIndex, column: columnIndex })
    })
  })
  return cells
}

export function addRandomTile(board: Board, random: Random = Math.random): Board {
  const empty = emptyCells(board)
  if (empty.length === 0) return board
  const cell = empty[Math.min(empty.length - 1, Math.floor(random() * empty.length))]
  const next = cloneBoard(board)
  next[cell.row][cell.column] = random() < 0.9 ? 2 : 4
  return next
}

export function createInitialBoard(random: Random = Math.random): Board {
  return addRandomTile(addRandomTile(createEmptyBoard(), random), random)
}

export function hasWon(board: Board): boolean {
  return board.some((row) => row.some((value) => value >= WINNING_TILE))
}

export function canMove(board: Board): boolean {
  for (let row = 0; row < BOARD_SIZE; row += 1) {
    for (let column = 0; column < BOARD_SIZE; column += 1) {
      const value = board[row][column]
      if (value === 0) return true
      if (column + 1 < BOARD_SIZE && board[row][column + 1] === value) return true
      if (row + 1 < BOARD_SIZE && board[row + 1][column] === value) return true
    }
  }
  return false
}

export function highestTile(board: Board): number {
  return board.reduce(
    (highest, row) => row.reduce((rowHighest, value) => Math.max(rowHighest, value), highest),
    0,
  )
}

export function applyMove(
  state: GameState,
  direction: Direction,
  options: { random?: Random; continueAfterWin?: boolean } = {},
): GameState {
  if (state.status === 'over') return state
  const result = move(state.board, direction)
  if (!result.moved) return state
  const board = addRandomTile(result.board, options.random ?? Math.random)
  const score = state.score + result.gained
  const status: GameState['status'] =
    hasWon(board) && !options.continueAfterWin
      ? 'won'
      : canMove(board)
        ? 'playing'
        : 'over'
  return { board, score, status }
}
