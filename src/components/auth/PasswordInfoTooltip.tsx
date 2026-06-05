import { AnimatePresence, motion } from "motion/react"

import { tooltipFade } from "../../lib/animation/motionPresets"
import { passwordRequirementLabels } from "../../lib/auth/passwordRules"

type PasswordInfoTooltipProps = {
  id: string
  open: boolean
}

export function PasswordInfoTooltip({ id, open }: PasswordInfoTooltipProps) {
  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="pointer-events-none absolute right-0 top-8 z-20 w-64 border border-[var(--color-border)] bg-white p-3 text-xs leading-5 text-[var(--color-ink)] shadow-[0_16px_40px_rgba(0,0,0,0.12)]"
          id={id}
          role="tooltip"
          {...tooltipFade}
        >
          <p className="mb-2 font-semibold">Şifre Gereksinimleri</p>
          <ul className="space-y-1 text-[var(--color-muted)]">
            {passwordRequirementLabels.map((rule) => (
              <li key={rule.key}>- {rule.label}</li>
            ))}
          </ul>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
