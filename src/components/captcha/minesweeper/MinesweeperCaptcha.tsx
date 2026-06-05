import { Panel } from "../../ui/Panel"
import { MinesweeperCloseButton } from "./MinesweeperCloseButton"
import { MinesweeperGrid } from "./MinesweeperGrid"
import { MinesweeperStatusBar } from "./MinesweeperStatusBar"

export function MinesweeperCaptcha() {
  return (
    <Panel
      aria-labelledby="minesweeper-captcha-title"
      aria-modal="true"
      className="auth-panel flex h-full max-h-[95vh] min-h-[560px] flex-col overflow-hidden px-5 py-6 text-[var(--color-ink)] sm:px-7"
      role="dialog"
    >
      <div className="flex shrink-0 items-start justify-between gap-4">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-muted)]">
            Daha Kolay Test
          </p>
          <h2 className="text-2xl font-semibold" id="minesweeper-captcha-title">
            Mayın Tarlası Captcha
          </h2>
          <p className="max-w-2xl text-sm leading-6 text-[var(--color-muted)]">
            Sadece 16 temiz kutu aç. İlk tıklamanın güvenli olacağına dair bir
            söz vermedik.
          </p>
        </div>

        <MinesweeperCloseButton />
      </div>

      <div className="mt-5 min-h-0 flex-1 overflow-auto pr-1">
        <div className="space-y-4">
          <MinesweeperStatusBar />
          <MinesweeperGrid />
        </div>
      </div>
    </Panel>
  )
}

