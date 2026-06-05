import { describe, expect, it } from "vitest"

import {
  generateSudokuPuzzle,
  getSudokuDecorativeBlankCells,
  getSudokuTargetCells,
  isSudokuBoardShapeValid,
} from "../lib/sudoku/generateSudokuPuzzle"
import {
  SUDOKU_DECORATIVE_BLANK_COORDINATES,
  SUDOKU_CORRECT_MESSAGE,
  SUDOKU_TARGET_COUNT,
  createSudokuWrongMessage,
} from "../lib/sudoku/sudokuConstants"
import { validateSudokuTargets } from "../lib/sudoku/validateSudokuTargets"

function fillTargetsCorrectly() {
  const board = generateSudokuPuzzle()

  for (const target of getSudokuTargetCells(board)) {
    board[target.row][target.col] = {
      ...target,
      value: target.solution,
    }
  }

  return board
}

describe("sudoku captcha logic", () => {
  it("generates a 9x9 grid with exactly 3 target cells", () => {
    const board = generateSudokuPuzzle()
    const targets = getSudokuTargetCells(board)

    expect(isSudokuBoardShapeValid(board)).toBe(true)
    expect(targets).toHaveLength(SUDOKU_TARGET_COUNT)
    expect(targets.every((cell) => cell.value === null && !cell.given)).toBe(true)
  })

  it("adds non-editable blank-looking cells without making them targets", () => {
    const board = generateSudokuPuzzle()
    const decorativeBlanks = getSudokuDecorativeBlankCells(board)

    expect(decorativeBlanks).toHaveLength(SUDOKU_DECORATIVE_BLANK_COORDINATES.length)
    expect(decorativeBlanks.every((cell) => !cell.target && !cell.given)).toBe(true)
    expect(decorativeBlanks.every((cell) => cell.value === null)).toBe(true)
  })

  it("blocks validation while a target cell is empty", () => {
    const result = validateSudokuTargets(generateSudokuPuzzle())

    expect(result.status).toBe("blocked")
    expect(result.wrongCount).toBeNull()
    expect(result.message).toMatch(/Üç kutuyu da doldurman/i)
  })

  it("returns the robot-suspicion message when all targets are correct", () => {
    const result = validateSudokuTargets(fillTargetsCorrectly())

    expect(result).toEqual({
      message: SUDOKU_CORRECT_MESSAGE,
      status: "correct",
      wrongCount: 0,
    })
  })

  it("counts wrong target cells", () => {
    const board = fillTargetsCorrectly()
    const firstTarget = getSudokuTargetCells(board)[0]

    board[firstTarget.row][firstTarget.col] = {
      ...firstTarget,
      value: firstTarget.solution === 9 ? 1 : firstTarget.solution + 1,
    }

    const result = validateSudokuTargets(board)

    expect(result).toEqual({
      message: createSudokuWrongMessage(1),
      status: "wrong",
      wrongCount: 1,
    })
  })
})
