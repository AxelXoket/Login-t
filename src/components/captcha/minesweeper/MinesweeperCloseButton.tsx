import { X } from "lucide-react"

import { useCaptchaStore } from "../../../stores/captchaStore"

export function MinesweeperCloseButton() {
  const incrementCloseAttempt = useCaptchaStore((state) => state.incrementCloseAttempt)

  return (
    <button
      aria-label="Kapat"
      className="mr-5 mt-2 inline-flex h-8 w-8 shrink-0 items-center justify-center border border-black bg-white/80 text-black transition hover:bg-black hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
      onClick={incrementCloseAttempt}
      type="button"
    >
      <X aria-hidden="true" size={16} strokeWidth={2} />
    </button>
  )
}
