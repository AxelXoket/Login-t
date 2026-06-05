import type { SudokuValidationResult } from "../../../lib/sudoku/validateSudokuTargets"

type SudokuResultMessageProps = {
  message: string | null
  tone: SudokuValidationResult["status"] | null
}

export function SudokuResultMessage({ message, tone }: SudokuResultMessageProps) {
  if (!message) {
    return null
  }

  const toneClass =
    tone === "blocked"
      ? "border-[var(--color-warning)]/35 text-[var(--color-warning)]"
      : "border-[var(--color-border)] text-[var(--color-muted)]"

  return (
    <p className={`border bg-white/70 px-3 py-3 text-sm leading-6 ${toneClass}`}>
      {message}
    </p>
  )
}
