export const panelEntrance = {
  initial: { opacity: 0, y: 18, scale: 0.985 },
  animate: { opacity: 1, y: 0, scale: 1 },
  transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
} as const

export const tabTransition = {
  type: "spring",
  stiffness: 420,
  damping: 34,
} as const

export const tooltipFade = {
  initial: { opacity: 0, y: 4, scale: 0.98 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: 4, scale: 0.98 },
  transition: { duration: 0.16 },
} as const

export const modalEntrance = {
  initial: { opacity: 0, scale: 0.96 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.98 },
  transition: { duration: 0.24, ease: "easeOut" },
} as const

export const mineModalGrow = {
  transition: {
    type: "spring",
    stiffness: 180,
    damping: 24,
  },
} as const
