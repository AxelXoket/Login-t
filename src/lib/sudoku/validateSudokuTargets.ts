import {
  createSudokuWrongMessage,
  SUDOKU_CORRECT_MESSAGE,
  SUDOKU_EMPTY_TARGET_MESSAGE,
  type SudokuBoard,
} from "./sudokuConstants"
import { getSudokuTargetCells } from "./generateSudokuPuzzle"

export type SudokuValidationResult =
  | {
      message: string
      status: "blocked"
      wrongCount: null
    }
  | {
      message: string
      status: "correct"
      wrongCount: 0
    }
  | {
      message: string
      status: "wrong"
      wrongCount: number
    }

export function validateSudokuTargets(board: SudokuBoard): SudokuValidationResult {
  const targetCells = getSudokuTargetCells(board)

  if (targetCells.some((cell) => cell.value === null)) {
    return {
      message: SUDOKU_EMPTY_TARGET_MESSAGE,
      status: "blocked",
      wrongCount: null,
    }
  }

  const wrongCount = targetCells.filter((cell) => cell.value !== cell.solution).length

  if (wrongCount === 0) {
    return {
      message: SUDOKU_CORRECT_MESSAGE,
      status: "correct",
      wrongCount: 0,
    }
  }

  return {
    message: createSudokuWrongMessage(wrongCount),
    status: "wrong",
    wrongCount,
  }
}
