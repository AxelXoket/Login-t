import type { MineCell } from "../../../lib/minesweeper/minefieldTypes"

type MinesweeperCellProps = {
  cell: MineCell
  onReveal: (row: number, col: number) => void
}

export function MinesweeperCell({ cell, onReveal }: MinesweeperCellProps) {
  const content = cell.isRevealed && cell.neighborMines > 0 ? cell.neighborMines : ""
  const label = cell.isRevealed
    ? `Açılmış hücre satır ${cell.row + 1}, sütun ${cell.col + 1}`
    : `Kapalı hücre satır ${cell.row + 1}, sütun ${cell.col + 1}`

  return (
    <button
      aria-label={label}
      className={[
        "aspect-square min-h-0 min-w-0 border border-black/20 text-[10px] font-semibold leading-none transition",
        "focus-visible:z-10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-black",
        cell.isRevealed
          ? "bg-white text-black"
          : "bg-zinc-100 text-transparent hover:bg-white hover:text-black",
      ].join(" ")}
      disabled={cell.isRevealed}
      onClick={() => onReveal(cell.row, cell.col)}
      type="button"
    >
      {content}
    </button>
  )
}

