import { beforeEach, describe, expect, it } from "vitest"

import { areNeighborCountsValid } from "../lib/minesweeper/calculateNeighborMines"
import { countMines, generateMinefield } from "../lib/minesweeper/generateMinefield"
import {
  MINEFIELD_COLS,
  MINEFIELD_ROWS,
  MINE_COUNT,
  MINE_FAIL_MESSAGE,
  REQUIRED_SAFE_REVEALS,
  type MineCell,
  type MinefieldBoard,
} from "../lib/minesweeper/minefieldTypes"
import { revealCell } from "../lib/minesweeper/revealCell"
import { useCaptchaStore } from "../stores/captchaStore"

function findCell(board: MinefieldBoard, predicate: (cell: MineCell) => boolean) {
  const cell = board.flat().find(predicate)

  if (!cell) {
    throw new Error("Expected matching minefield cell")
  }

  return cell
}

describe("minesweeper captcha logic", () => {
  beforeEach(() => {
    useCaptchaStore.getState().resetCaptcha()
  })

  it("generates a 16x16 board with exactly 55 mines and valid neighbor counts", () => {
    const board = generateMinefield()

    expect(board).toHaveLength(MINEFIELD_ROWS)
    expect(board.every((row) => row.length === MINEFIELD_COLS)).toBe(true)
    expect(countMines(board)).toBe(MINE_COUNT)
    expect(areNeighborCountsValid(board)).toBe(true)
  })

  it("reveals a safe cell once and does not double-count the same cell", () => {
    const board = generateMinefield()
    const safeCell = findCell(board, (cell) => !cell.isMine)
    const firstReveal = revealCell(board, safeCell.row, safeCell.col, 0)
    const secondReveal = revealCell(
      firstReveal.board,
      safeCell.row,
      safeCell.col,
      firstReveal.revealedSafeCount,
    )

    expect(firstReveal.status).toBe("playing")
    expect(firstReveal.revealedSafeCount).toBe(1)
    expect(firstReveal.board[safeCell.row][safeCell.col].isRevealed).toBe(true)
    expect(secondReveal.revealedSafeCount).toBe(1)
  })

  it("fails when revealing a mine", () => {
    const board = generateMinefield()
    const mineCell = findCell(board, (cell) => cell.isMine)
    const result = revealCell(board, mineCell.row, mineCell.col, 0)

    expect(result.status).toBe("failed")
    expect(result.message).toBe(MINE_FAIL_MESSAGE)
  })

  it("resets the minefield after a mine while preserving close attempts", () => {
    useCaptchaStore.getState().startMinesweeper()
    useCaptchaStore.getState().incrementCloseAttempt()

    const originalBoard = useCaptchaStore.getState().minefield
    const mineCell = findCell(originalBoard, (cell) => cell.isMine)

    useCaptchaStore.getState().revealMineCell(mineCell.row, mineCell.col)

    const state = useCaptchaStore.getState()

    expect(state.step).toBe("minesweeper")
    expect(state.closeAttemptCount).toBe(1)
    expect(state.minefield).not.toBe(originalBoard)
    expect(countMines(state.minefield)).toBe(MINE_COUNT)
    expect(state.minefieldMessage).toBe(MINE_FAIL_MESSAGE)
    expect(state.minefieldStatus).toBe("failed")
    expect(state.revealedSafeCount).toBe(0)
  })

  it("marks success only after 16 safe reveals", () => {
    useCaptchaStore.getState().startMinesweeper()

    const safeCells = useCaptchaStore
      .getState()
      .minefield.flat()
      .filter((cell) => !cell.isMine)
      .slice(0, REQUIRED_SAFE_REVEALS)

    for (const safeCell of safeCells) {
      useCaptchaStore.getState().revealMineCell(safeCell.row, safeCell.col)
    }

    const state = useCaptchaStore.getState()

    expect(state.step).toBe("success")
    expect(state.minefieldStatus).toBe("success")
    expect(state.revealedSafeCount).toBe(REQUIRED_SAFE_REVEALS)
  })

  it("clears captcha progress after Minesweeper outside dismissal", () => {
    useCaptchaStore.getState().startMinesweeper()
    useCaptchaStore.getState().incrementCloseAttempt()

    const safeCell = findCell(useCaptchaStore.getState().minefield, (cell) => !cell.isMine)

    useCaptchaStore.getState().revealMineCell(safeCell.row, safeCell.col)
    useCaptchaStore.getState().dismissMinesweeperToLogin()

    const state = useCaptchaStore.getState()

    expect(state.step).toBe("none")
    expect(state.sudokuResult).toBeNull()
    expect(state.sudokuMessage).toBeNull()
    expect(state.closeAttemptCount).toBe(0)
    expect(state.revealedSafeCount).toBe(0)
    expect(state.minefieldStatus).toBe("idle")
    expect(state.minefieldMessage).toBeNull()
    expect(countMines(state.minefield)).toBe(MINE_COUNT)
  })
})
