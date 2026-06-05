import { AnimatePresence, motion } from "motion/react"

import { useAuthStore } from "../../stores/authStore"
import { Panel } from "../ui/Panel"
import { AuthTabs } from "./AuthTabs"
import { LoginForm } from "./LoginForm"
import { SignupForm } from "./SignupForm"

export function AuthPanel() {
  const activeTab = useAuthStore((state) => state.activeTab)

  return (
    <Panel className="auth-panel min-h-[620px] px-7 py-8 sm:px-9">
      <div className="flex h-full flex-col gap-7">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-muted)]">
            Frontend-only parody
          </p>
          <h1 className="text-3xl font-semibold">Anti-UX Login Hell</h1>
          <p className="text-sm leading-6 text-[var(--color-muted)]">
            Modern görünen, gereksizce zorlaştırılmış bir giriş deneyimi.
          </p>
        </div>

        <AuthTabs />

        <div className="min-h-[390px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              initial={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.18 }}
            >
              {activeTab === "signup" ? <SignupForm /> : <LoginForm />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </Panel>
  )
}
