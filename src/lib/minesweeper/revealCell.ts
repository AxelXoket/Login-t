import {
  MINE_FAIL_MESSAGE,
  MINE_SUCCESS_MESSAGE,
  REQUIRED_SAFE_REVEALS,
  type MinefieldBoard,
  type MinefieldStatus,
} from "./minefieldTypes"

export type MineRevealResult = {
  board: MinefieldBoard
  message: string | null
  revealedSafeCount: number
  status: MinefieldStatus
}

export function revealCell(
  board: MinefieldBoard,
  row: number,
  col: number,
  revealedSafeCount: number,
): MineRevealResult {
  const cell = board[row]?.[col]

  if (!cell || cell.isRevealed) {
    return {
      board,
      message: null,
      revealedSafeCount,
      status: "playing",
    }
  }

  if (cell.isMine) {
    return {
      board,
      message: MINE_FAIL_MESSAGE,
      revealedSafeCount,
      status: "failed",
    }
  }

  const nextBoard = board.map((boardRow, rowIndex) =>
    boardRow.map((boardCell, colIndex) =>
      rowIndex === row && colIndex === col
        ? {
            ...boardCell,
            isRevealed: true,
          }
        : boardCell,
    ),
  )
  const nextSafeCount = revealedSafeCount + 1

  return {
    board: nextBoard,
    message: nextSafeCount >= REQUIRED_SAFE_REVEALS ? MINE_SUCCESS_MESSAGE : null,
    revealedSafeCount: nextSafeCount,
    status: nextSafeCount >= REQUIRED_SAFE_REVEALS ? "success" : "playing",
  }
}

