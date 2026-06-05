import type { ChangeEvent } from "react"

import type { SudokuCell as SudokuCellModel } from "../../../lib/sudoku/sudokuConstants"
import { useCaptchaStore } from "../../../stores/captchaStore"

type SudokuCellProps = {
  cell: SudokuCellModel
}

export function SudokuCell({ cell }: SudokuCellProps) {
  const updateSudokuCell = useCaptchaStore((state) => state.updateSudokuCell)

  const borderClasses = [
    cell.col > 0 && cell.col % 3 === 0 ? "border-l-2 border-l-black" : "",
    cell.row > 0 && cell.row % 3 === 0 ? "border-t-2 border-t-black" : "",
  ]
    .filter(Boolean)
    .join(" ")

  if (!cell.target) {
    const displayValue = cell.given ? cell.solution : ""

    return (
      <div
        aria-label={
          cell.given
            ? `Satır ${cell.row + 1} sütun ${cell.col + 1}: ${cell.solution}`
            : `Boş görünen satır ${cell.row + 1} sütun ${cell.col + 1}`
        }
        className={[
          "grid aspect-square place-items-center border border-black/15 text-sm font-medium sm:text-base",
          cell.given ? "bg-white/70 text-[var(--color-muted)]" : "bg-white/35 text-transparent",
          borderClasses,
        ].join(" ")}
        role="gridcell"
      >
        {displayValue}
      </div>
    )
  }

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const nextValue = event.target.value.replace(/[^1-9]/g, "").slice(-1)
    updateSudokuCell(cell.row, cell.col, nextValue ? Number(nextValue) : null)
  }

  return (
    <div
      className={[
        "grid aspect-square place-items-center border border-black/25 bg-black/[0.06]",
        borderClasses,
      ].join(" ")}
      role="gridcell"
    >
      <input
        aria-label={`Hedef satır ${cell.row + 1} sütun ${cell.col + 1}`}
        className="h-full w-full bg-transparent text-center text-base font-semibold text-black outline-none transition focus:bg-black focus:text-white sm:text-lg"
        inputMode="numeric"
        maxLength={1}
        onChange={handleChange}
        pattern="[1-9]"
        value={cell.value ?? ""}
      />
    </div>
  )
}
