import { MINE_SUCCESS_MESSAGE } from "../../lib/minesweeper/minefieldTypes"
import { Panel } from "../ui/Panel"

export function FinalSuccessScreen() {
  return (
    <Panel
      aria-labelledby="final-success-title"
      aria-modal="true"
      className="auth-panel px-7 py-8 text-[var(--color-ink)] sm:px-9"
      role="dialog"
    >
      <div className="space-y-5">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-muted)]">
          Minimum Başarı
        </p>
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold" id="final-success-title">
            Giriş Başarılı
          </h2>
          <p className="max-w-prose text-sm leading-6 text-[var(--color-muted)]">
            {MINE_SUCCESS_MESSAGE}
          </p>
        </div>
        <div
          aria-hidden="true"
          className="h-1 w-full border border-[var(--color-border)] bg-[linear-gradient(90deg,#000_0%,#000_100%)]"
        />
      </div>
    </Panel>
  )
}
