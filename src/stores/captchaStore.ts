import { create } from "zustand"

import { generateMinefield } from "../lib/minesweeper/generateMinefield"
import {
  CLOSE_ATTEMPT_MESSAGES,
  MINE_FAIL_MESSAGE,
  type MinefieldBoard,
  type MinefieldStatus,
} from "../lib/minesweeper/minefieldTypes"
import { revealCell } from "../lib/minesweeper/revealCell"
import { generateSudokuPuzzle } from "../lib/sudoku/generateSudokuPuzzle"
import type { SudokuBoard } from "../lib/sudoku/sudokuConstants"
import {
  validateSudokuTargets,
  type SudokuValidationResult,
} from "../lib/sudoku/validateSudokuTargets"

export type CaptchaStep =
  | "none"
  | "sudoku"
  | "sudoku-result"
  | "minesweeper"
  | "success"
  | "failed"

type CaptchaStore = {
  step: CaptchaStep
  closeAttemptCount: number
  minefield: MinefieldBoard
  minefieldMessage: string | null
  minefieldStatus: MinefieldStatus
  revealedSafeCount: number
  sudokuBoard: SudokuBoard
  sudokuMessage: string | null
  sudokuResult: SudokuValidationResult | null
  dismissMinesweeperToLogin: () => void
  incrementCloseAttempt: () => void
  markSuccess: () => void
  proceedToMinesweeper: () => void
  resetMinefieldPreservingCloseAttempts: () => void
  resetCaptcha: () => void
  revealMineCell: (row: number, col: number) => void
  startMinesweeper: () => void
  startSudoku: () => void
  updateSudokuCell: (row: number, col: number, value: number | null) => void
  validateSudokuTargets: () => void
}

const initialSudokuBoard = generateSudokuPuzzle()
const initialMinefield = generateMinefield()

function sanitizeSudokuValue(value: number | null) {
  if (value === null) {
    return null
  }

  return value >= 1 && value <= 9 ? value : null
}

export const useCaptchaStore = create<CaptchaStore>((set, get) => ({
  step: "none",
  closeAttemptCount: 0,
  minefield: initialMinefield,
  minefieldMessage: null,
  minefieldStatus: "idle",
  revealedSafeCount: 0,
  sudokuBoard: initialSudokuBoard,
  sudokuMessage: null,
  sudokuResult: null,
  dismissMinesweeperToLogin: () =>
    set({
      closeAttemptCount: 0,
      minefield: generateMinefield(),
      minefieldMessage: null,
      minefieldStatus: "idle",
      revealedSafeCount: 0,
      sudokuBoard: generateSudokuPuzzle(),
      sudokuMessage: null,
      sudokuResult: null,
      step: "none",
    }),
  incrementCloseAttempt: () =>
    set((state) => {
      const nextCount = state.closeAttemptCount + 1
      const messageIndex = Math.min(nextCount - 1, CLOSE_ATTEMPT_MESSAGES.length - 1)

      return {
        closeAttemptCount: nextCount,
        minefieldMessage: CLOSE_ATTEMPT_MESSAGES[messageIndex],
      }
    }),
  markSuccess: () =>
    set({
      minefieldStatus: "success",
      step: "success",
    }),
  proceedToMinesweeper: () => get().startMinesweeper(),
  resetMinefieldPreservingCloseAttempts: () =>
    set({
      minefield: generateMinefield(),
      minefieldMessage: MINE_FAIL_MESSAGE,
      minefieldStatus: "failed",
      revealedSafeCount: 0,
      step: "minesweeper",
    }),
  resetCaptcha: () =>
    set({
      closeAttemptCount: 0,
      minefield: generateMinefield(),
      minefieldMessage: null,
      minefieldStatus: "idle",
      revealedSafeCount: 0,
      sudokuBoard: generateSudokuPuzzle(),
      sudokuMessage: null,
      sudokuResult: null,
      step: "none",
    }),
  revealMineCell: (row, col) => {
    const state = get()

    if (state.step !== "minesweeper" || state.minefieldStatus === "success") {
      return
    }

    const result = revealCell(state.minefield, row, col, state.revealedSafeCount)

    if (result.status === "failed") {
      get().resetMinefieldPreservingCloseAttempts()
      return
    }

    if (result.status === "success") {
      set({
        minefield: result.board,
        minefieldMessage: result.message,
        minefieldStatus: "success",
        revealedSafeCount: result.revealedSafeCount,
        step: "success",
      })
      return
    }

    set({
      minefield: result.board,
      minefieldMessage: result.message,
      minefieldStatus: result.status,
      revealedSafeCount: result.revealedSafeCount,
    })
  },
  startMinesweeper: () =>
    set({
      closeAttemptCount: 0,
      minefield: generateMinefield(),
      minefieldMessage: null,
      minefieldStatus: "playing",
      revealedSafeCount: 0,
      step: "minesweeper",
      sudokuMessage: null,
      sudokuResult: null,
    }),
  startSudoku: () =>
    set({
      closeAttemptCount: 0,
      minefield: generateMinefield(),
      minefieldMessage: null,
      minefieldStatus: "idle",
      revealedSafeCount: 0,
      sudokuBoard: generateSudokuPuzzle(),
      sudokuMessage: null,
      sudokuResult: null,
      step: "sudoku",
    }),
  updateSudokuCell: (row, col, value) =>
    set((state) => ({
      sudokuBoard: state.sudokuBoard.map((boardRow, rowIndex) =>
        boardRow.map((cell, colIndex) => {
          if (rowIndex !== row || colIndex !== col || !cell.target) {
            return cell
          }

          return {
            ...cell,
            value: sanitizeSudokuValue(value),
          }
        }),
      ),
      sudokuMessage: state.step === "sudoku" ? null : state.sudokuMessage,
    })),
  validateSudokuTargets: () => {
    const result = validateSudokuTargets(get().sudokuBoard)

    if (result.status === "blocked") {
      set({
        step: "sudoku",
        sudokuMessage: result.message,
        sudokuResult: result,
      })
      return
    }

    set({
      step: "sudoku-result",
      sudokuMessage: result.message,
      sudokuResult: result,
    })
  },
}))
