import { Info } from "lucide-react"
import type { DragEvent, InputHTMLAttributes, ReactEventHandler } from "react"
import { useId, useState } from "react"

import { Input } from "../ui/Input"
import { PasswordInfoTooltip } from "./PasswordInfoTooltip"

type PasswordFieldMode = "password" | "confirm" | "none"

type PasswordFieldProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "maxLength"> & {
  blockMode?: PasswordFieldMode
  label: string
  onBlockedAction?: (message: string) => void
  showRequirements?: boolean
}

export function PasswordField({
  blockMode = "none",
  className = "",
  id,
  label,
  onBlockedAction,
  showRequirements = false,
  ...props
}: PasswordFieldProps) {
  const generatedId = useId()
  const inputId = id ?? generatedId
  const tooltipId = `${inputId}-requirements`
  const [tooltipOpen, setTooltipOpen] = useState(false)

  const blockedHandlers = getBlockedHandlers(blockMode, onBlockedAction)

  return (
    <div className="auth-field">
      <label className="auth-field-label" htmlFor={inputId}>
        {label}
      </label>
      <div className="relative">
        <Input
          autoComplete={props.autoComplete}
          className={[showRequirements ? "pr-8" : "", className].join(" ")}
          id={inputId}
          type="password"
          {...blockedHandlers}
          {...props}
        />
        {showRequirements ? (
          <>
            <button
              aria-describedby={tooltipOpen ? tooltipId : undefined}
              aria-label="Şifre Gereksinimleri"
              className="absolute right-2 top-1/2 grid h-4 w-4 -translate-y-1/2 place-items-center bg-transparent p-0 text-black/75 transition hover:text-black focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-1 focus-visible:outline-black"
              onBlur={() => setTooltipOpen(false)}
              onFocus={() => setTooltipOpen(true)}
              onMouseEnter={() => setTooltipOpen(true)}
              onMouseLeave={() => setTooltipOpen(false)}
              type="button"
            >
              <Info aria-hidden="true" size={12} strokeWidth={2.4} />
            </button>
            <PasswordInfoTooltip id={tooltipId} open={tooltipOpen} />
          </>
        ) : null}
      </div>
    </div>
  )
}

function getBlockedHandlers(
  mode: PasswordFieldMode,
  onBlockedAction?: (message: string) => void,
): Partial<InputHTMLAttributes<HTMLInputElement>> {
  if (mode === "password") {
    return {
      onContextMenu: block("Menü kapalı. Tahmin etmeliydin.", onBlockedAction),
      onCopy: block("Kopyalamak yok. Ezberle.", onBlockedAction),
      onCut: block("Kesmek de fazla yardımcı.", onBlockedAction),
      onDragStart: blockDrag("Sürükleyerek kaçamazsın.", onBlockedAction),
    }
  }

  if (mode === "confirm") {
    return {
      onContextMenu: block("Sağ tık burada da çalışmıyor.", onBlockedAction),
      onDrop: blockDrag("Bırakma eylemi reddedildi.", onBlockedAction),
      onPaste: block("Yapıştırmak kullanıcı dostu olurdu.", onBlockedAction),
    }
  }

  return {}
}

function block(
  message: string,
  onBlockedAction?: (message: string) => void,
): ReactEventHandler<HTMLInputElement> {
  return (event) => {
    event.preventDefault()
    onBlockedAction?.(message)
  }
}

function blockDrag(
  message: string,
  onBlockedAction?: (message: string) => void,
): (event: DragEvent<HTMLInputElement>) => void {
  return (event) => {
    event.preventDefault()
    onBlockedAction?.(message)
  }
}
