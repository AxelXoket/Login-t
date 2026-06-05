import { motion } from "motion/react"

import { panelEntrance } from "../../lib/animation/motionPresets"
import { AuthPanel } from "./AuthPanel"

export function AuthShell() {
  return (
    <main className="relative z-10 grid min-h-screen place-items-center px-4 py-8 text-[var(--color-ink)] sm:px-6">
      <motion.div className="w-full max-w-[430px]" {...panelEntrance}>
        <AuthPanel />
      </motion.div>
    </main>
  )
}
