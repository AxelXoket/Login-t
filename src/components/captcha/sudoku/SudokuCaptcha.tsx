import { useCaptchaStore } from "../../../stores/captchaStore"
import { Button } from "../../ui/Button"
import { Panel } from "../../ui/Panel"
import { SudokuGrid } from "./SudokuGrid"
import { SudokuResultMessage } from "./SudokuResultMessage"

export function SudokuCaptcha() {
  const message = useCaptchaStore((state) => state.sudokuMessage)
  const proceedToMinesweeper = useCaptchaStore((state) => state.proceedToMinesweeper)
  const result = useCaptchaStore((state) => state.sudokuResult)
  const step = useCaptchaStore((state) => state.step)
  const validateTargets = useCaptchaStore((state) => state.validateSudokuTargets)

  const hasFinalResult = step === "sudoku-result" && result?.status !== "blocked"

  return (
    <Panel
      aria-labelledby="sudoku-captcha-title"
      aria-modal="true"
      className="auth-panel px-5 py-6 text-[var(--color-ink)] sm:px-7"
      role="dialog"
    >
      <div className="space-y-5">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-muted)]">
            İnsanlık Kontrolü
          </p>
          <h2 className="text-2xl font-semibold" id="sudoku-captcha-title">
            Sudoku Captcha
          </h2>
          <p className="text-sm leading-6 text-[var(--color-muted)]">
            Sadece işaretli üç kutuyu doldur. Tabii ki bu yeterli olmayacak.
          </p>
        </div>

        <SudokuGrid />

        <SudokuResultMessage message={message} tone={result?.status ?? null} />

        {hasFinalResult ? (
          <Button onClick={proceedToMinesweeper} type="button">
            Daha Kolay Teste Geç
          </Button>
        ) : (
          <Button onClick={validateTargets} type="button">
            Doğrula
          </Button>
        )}
      </div>
    </Panel>
  )
}
