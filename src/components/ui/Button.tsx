import type { ButtonHTMLAttributes } from "react"

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>

export function Button({ className = "", type = "button", ...props }: ButtonProps) {
  return (
    <button
      className={[
        "inline-flex h-11 w-full items-center justify-center gap-2 border border-black bg-black px-4 text-sm font-medium text-white",
        "transition hover:bg-white hover:text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className,
      ].join(" ")}
      type={type}
      {...props}
    />
  )
}
