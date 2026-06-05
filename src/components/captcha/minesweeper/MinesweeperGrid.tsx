import { MINEFIELD_COLS, MINEFIELD_ROWS } from "../../../lib/minesweeper/minefieldTypes"
import { useCaptchaStore } from "../../../stores/captchaStore"
import { MinesweeperCell } from "./MinesweeperCell"

export function MinesweeperGrid() {
  const board = useCaptchaStore((state) => state.minefield)
  const revealMineCell = useCaptchaStore((state) => state.revealMineCell)

  return (
    <div
      aria-label={`Mayın Tarlası ${MINEFIELD_ROWS}x${MINEFIELD_COLS}`}
      className="mx-auto grid w-full max-w-[42rem] grid-cols-[repeat(16,minmax(0,1fr))] gap-px border border-black bg-black/20 p-px"
      role="grid"
    >
      {board.flat().map((cell) => (
        <MinesweeperCell
          cell={cell}
          key={`${cell.row}-${cell.col}`}
          onReveal={revealMineCell}
        />
      ))}
    </div>
  )
}

