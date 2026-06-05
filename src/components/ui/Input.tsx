import type { InputHTMLAttributes } from "react"

type InputProps = InputHTMLAttributes<HTMLInputElement>

export function Input({ className = "", ...props }: InputProps) {
  return (
    <input
      className={[
        "h-11 w-full border border-[var(--color-border)] bg-white/75 px-3 text-sm text-[var(--color-ink)]",
        "placeholder:text-[var(--color-muted)] focus:border-black focus:outline-none focus:ring-2 focus:ring-black/10",
        className,
      ].join(" ")}
      {...props}
    />
  )
}
