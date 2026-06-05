import {
  SUDOKU_SIZE,
  SUDOKU_DECORATIVE_BLANK_COORDINATES,
  SUDOKU_SOLVED_BOARD,
  SUDOKU_TARGET_COORDINATES,
  type SudokuBoard,
} from "./sudokuConstants"

function isTargetCell(row: number, col: number) {
  return SUDOKU_TARGET_COORDINATES.some((target) => target.row === row && target.col === col)
}

function isDecorativeBlankCell(row: number, col: number) {
  return SUDOKU_DECORATIVE_BLANK_COORDINATES.some(
    (coordinate) => coordinate.row === row && coordinate.col === col,
  )
}

export function generateSudokuPuzzle(): SudokuBoard {
  return SUDOKU_SOLVED_BOARD.map((rowValues, row) =>
    rowValues.map((solution, col) => {
      const target = isTargetCell(row, col)
      const decorativeBlank = !target && isDecorativeBlankCell(row, col)

      return {
        col,
        given: !target && !decorativeBlank,
        row,
        solution,
        target,
        value: target || decorativeBlank ? null : solution,
      }
    }),
  )
}

export function getSudokuTargetCells(board: SudokuBoard) {
  return board.flatMap((row) => row.filter((cell) => cell.target))
}

export function getSudokuDecorativeBlankCells(board: SudokuBoard) {
  return board.flatMap((row) => row.filter((cell) => !cell.target && !cell.given))
}

export function isSudokuBoardShapeValid(board: SudokuBoard) {
  return (
    board.length === SUDOKU_SIZE &&
    board.every((row) => row.length === SUDOKU_SIZE)
  )
}
