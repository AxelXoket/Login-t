import { useCaptchaStore } from "../../../stores/captchaStore"
import { SudokuCell } from "./SudokuCell"

export function SudokuGrid() {
  const board = useCaptchaStore((state) => state.sudokuBoard)

  return (
    <div
      aria-label="Sudoku 9x9"
      className="grid aspect-square w-full grid-cols-9 border-2 border-black bg-white"
      role="grid"
    >
      {board.map((row) =>
        row.map((cell) => (
          <SudokuCell cell={cell} key={`${cell.row}-${cell.col}`} />
        )),
      )}
    </div>
  )
}
