import { MINE_COUNT, REQUIRED_SAFE_REVEALS } from "../../../lib/minesweeper/minefieldTypes"
import { useCaptchaStore } from "../../../stores/captchaStore"

export function MinesweeperStatusBar() {
  const closeAttemptCount = useCaptchaStore((state) => state.closeAttemptCount)
  const message = useCaptchaStore((state) => state.minefieldMessage)
  const revealedSafeCount = useCaptchaStore((state) => state.revealedSafeCount)

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-3 border border-[var(--color-border)] bg-white/70 text-center text-xs uppercase tracking-[0.14em] text-[var(--color-muted)]">
        <div className="border-r border-[var(--color-border)] px-3 py-2">
          {revealedSafeCount} / {REQUIRED_SAFE_REVEALS}
        </div>
        <div className="border-r border-[var(--color-border)] px-3 py-2">{MINE_COUNT} Mayın</div>
        <div className="px-3 py-2">{closeAttemptCount} Kaçış</div>
      </div>

      {message ? (
        <p className="border border-[var(--color-border)] bg-white/75 px-3 py-2 text-sm leading-6 text-[var(--color-muted)]">
          {message}
        </p>
      ) : null}
    </div>
  )
}

