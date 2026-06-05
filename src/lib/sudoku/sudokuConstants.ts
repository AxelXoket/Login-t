export type SudokuCoordinate = {
  row: number
  col: number
}

export type SudokuCell = SudokuCoordinate & {
  given: boolean
  solution: number
  target: boolean
  value: number | null
}

export type SudokuBoard = SudokuCell[][]

export const SUDOKU_SIZE = 9
export const SUDOKU_TARGET_COUNT = 3

export const SUDOKU_SOLVED_BOARD: number[][] = [
  [5, 3, 4, 6, 7, 8, 9, 1, 2],
  [6, 7, 2, 1, 9, 5, 3, 4, 8],
  [1, 9, 8, 3, 4, 2, 5, 6, 7],
  [8, 5, 9, 7, 6, 1, 4, 2, 3],
  [4, 2, 6, 8, 5, 3, 7, 9, 1],
  [7, 1, 3, 9, 2, 4, 8, 5, 6],
  [9, 6, 1, 5, 3, 7, 2, 8, 4],
  [2, 8, 7, 4, 1, 9, 6, 3, 5],
  [3, 4, 5, 2, 8, 6, 1, 7, 9],
]

export const SUDOKU_TARGET_COORDINATES: SudokuCoordinate[] = [
  { row: 0, col: 2 },
  { row: 4, col: 4 },
  { row: 8, col: 6 },
]

export const SUDOKU_DECORATIVE_BLANK_COORDINATES: SudokuCoordinate[] = [
  { row: 0, col: 0 },
  { row: 0, col: 5 },
  { row: 0, col: 7 },
  { row: 1, col: 1 },
  { row: 1, col: 4 },
  { row: 1, col: 8 },
  { row: 2, col: 0 },
  { row: 2, col: 3 },
  { row: 2, col: 6 },
  { row: 3, col: 2 },
  { row: 3, col: 5 },
  { row: 3, col: 8 },
  { row: 4, col: 1 },
  { row: 4, col: 7 },
  { row: 5, col: 0 },
  { row: 5, col: 3 },
  { row: 5, col: 6 },
  { row: 6, col: 2 },
  { row: 6, col: 4 },
  { row: 6, col: 8 },
  { row: 7, col: 0 },
  { row: 7, col: 3 },
  { row: 7, col: 7 },
  { row: 8, col: 1 },
  { row: 8, col: 5 },
  { row: 8, col: 8 },
]

export const SUDOKU_EMPTY_TARGET_MESSAGE =
  "Üç kutuyu da doldurman gerekiyordu. Fazla mı doğrudandı?"

export const SUDOKU_CORRECT_MESSAGE =
  "Bu kadar doğru çözmen şüpheli. Robotlar artık Sudoku çözebiliyor olmalılar. Seni daha kolay bir test ile sınayacağız."

export function createSudokuWrongMessage(wrongCount: number) {
  return `3 kutucuktan ${wrongCount} tanesini yanlış doldurdun. Bu nedenle seni daha kolay bir test ile sınayacağız.`
}
