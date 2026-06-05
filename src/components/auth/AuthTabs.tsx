import { motion } from "motion/react"

import { tabTransition } from "../../lib/animation/motionPresets"
import { type AuthTab, useAuthStore } from "../../stores/authStore"

const tabs: Array<{ label: string; value: AuthTab }> = [
  { label: "Giriş Yap", value: "login" },
  { label: "Kaydol", value: "signup" },
]

export function AuthTabs() {
  const activeTab = useAuthStore((state) => state.activeTab)
  const setActiveTab = useAuthStore((state) => state.setActiveTab)

  return (
    <div
      aria-label="Auth sections"
      className="grid grid-cols-2 border border-[var(--color-border)] bg-white/45 p-1"
      role="tablist"
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.value

        return (
          <button
            aria-selected={isActive}
            className={[
              "relative h-10 text-sm font-medium transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black",
              isActive ? "text-white" : "text-[var(--color-muted)] hover:text-black",
            ].join(" ")}
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            role="tab"
            type="button"
          >
            {isActive ? (
              <motion.span
                className="absolute inset-0 bg-black"
                layoutId="auth-tab-indicator"
                transition={tabTransition}
              />
            ) : null}
            <span className="relative z-10">{tab.label}</span>
          </button>
        )
      })}
    </div>
  )
}
