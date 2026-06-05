import type { MineCell, MinefieldBoard } from "./minefieldTypes"

const NEIGHBOR_OFFSETS = [-1, 0, 1] as const

type MineMapCell = Pick<MineCell, "isMine">
type MineMap = MineMapCell[][]

export function calculateNeighborMines(board: MineMap, row: number, col: number) {
  let count = 0

  for (const rowOffset of NEIGHBOR_OFFSETS) {
    for (const colOffset of NEIGHBOR_OFFSETS) {
      if (rowOffset === 0 && colOffset === 0) {
        continue
      }

      if (board[row + rowOffset]?.[col + colOffset]?.isMine) {
        count += 1
      }
    }
  }

  return count
}

export function areNeighborCountsValid(board: MinefieldBoard) {
  return board.every((row, rowIndex) =>
    row.every(
      (cell, colIndex) =>
        cell.isMine || cell.neighborMines === calculateNeighborMines(board, rowIndex, colIndex),
    ),
  )
}

