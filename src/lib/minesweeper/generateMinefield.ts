import { calculateNeighborMines } from "./calculateNeighborMines"
import {
  MINEFIELD_COLS,
  MINEFIELD_ROWS,
  MINE_COUNT,
  type MinefieldBoard,
} from "./minefieldTypes"

type RandomSource = () => number

function shuffleIndexes(indexes: number[], random: RandomSource) {
  const shuffled = [...indexes]

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1))
    const current = shuffled[index]
    const replacement = shuffled[swapIndex]

    shuffled[index] = replacement
    shuffled[swapIndex] = current
  }

  return shuffled
}

export function generateMinefield(random: RandomSource = Math.random): MinefieldBoard {
  const cellCount = MINEFIELD_ROWS * MINEFIELD_COLS
  const indexes = Array.from({ length: cellCount }, (_, index) => index)
  const mineIndexes = new Set(shuffleIndexes(indexes, random).slice(0, MINE_COUNT))

  const board: MinefieldBoard = Array.from({ length: MINEFIELD_ROWS }, (_, row) =>
    Array.from({ length: MINEFIELD_COLS }, (_, col) => {
      const index = row * MINEFIELD_COLS + col

      return {
        col,
        isMine: mineIndexes.has(index),
        isRevealed: false,
        neighborMines: 0,
        row,
      }
    }),
  )

  return board.map((row, rowIndex) =>
    row.map((cell, colIndex) => ({
      ...cell,
      neighborMines: calculateNeighborMines(board, rowIndex, colIndex),
    })),
  )
}

export function countMines(board: MinefieldBoard) {
  return board.flat().filter((cell) => cell.isMine).length
}

