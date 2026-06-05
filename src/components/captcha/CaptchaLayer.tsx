import { AnimatePresence, motion } from "motion/react"

import { mineModalGrow, modalEntrance } from "../../lib/animation/motionPresets"
import { useAuthStore } from "../../stores/authStore"
import { useCaptchaStore } from "../../stores/captchaStore"
import { FinalSuccessScreen } from "./FinalSuccessScreen"
import { MinesweeperCaptcha } from "./minesweeper/MinesweeperCaptcha"
import { SudokuCaptcha } from "./sudoku/SudokuCaptcha"

export function CaptchaLayer() {
  const closeAttemptCount = useCaptchaStore((state) => state.closeAttemptCount)
  const dismissMinesweeperToLogin = useCaptchaStore((state) => state.dismissMinesweeperToLogin)
  const resetLoginAfterCaptchaDismissal = useAuthStore(
    (state) => state.resetLoginAfterCaptchaDismissal,
  )
  const step = useCaptchaStore((state) => state.step)
  const isMinesweeper = step === "minesweeper"

  function handleOverlayClick() {
    if (!isMinesweeper) {
      return
    }

    dismissMinesweeperToLogin()
    resetLoginAfterCaptchaDismissal()
  }

  return (
    <AnimatePresence>
      {step !== "none" ? (
        <motion.div
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-30 grid place-items-center bg-white/45 px-4 py-6 backdrop-blur-[2px]"
          exit={{ opacity: 0 }}
          initial={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
        >
          <motion.div
            className="absolute inset-0"
            data-testid="captcha-overlay"
            onClick={handleOverlayClick}
          />

          <AnimatePresence mode="wait">
            <motion.div
              animate={modalEntrance.animate}
              className={[
                "relative z-10 w-full",
                isMinesweeper ? getMinesweeperFrameClass(closeAttemptCount) : "max-w-[590px]",
              ].join(" ")}
              exit={modalEntrance.exit}
              initial={modalEntrance.initial}
              key={getCaptchaContentKey(step)}
              layout={isMinesweeper}
              transition={isMinesweeper ? mineModalGrow.transition : modalEntrance.transition}
            >
              {step === "minesweeper" ? <MinesweeperCaptcha /> : null}
              {step === "success" ? <FinalSuccessScreen /> : null}
              {step === "sudoku" || step === "sudoku-result" ? <SudokuCaptcha /> : null}
            </motion.div>
          </AnimatePresence>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}

function getCaptchaContentKey(step: string) {
  if (step === "sudoku" || step === "sudoku-result") {
    return "sudoku"
  }

  return step
}

function getMinesweeperFrameClass(closeAttemptCount: number) {
  if (closeAttemptCount <= 0) {
    return "max-w-[760px]"
  }

  if (closeAttemptCount === 1) {
    return "max-w-[836px] scale-[1.02]"
  }

  if (closeAttemptCount === 2) {
    return "h-[82vh] max-w-[1120px]"
  }

  if (closeAttemptCount === 3) {
    return "h-[95vh] max-w-none w-[95vw]"
  }

  return "h-screen max-w-none w-screen"
}
