import { useState, type FormEvent } from "react"

import { useAuthStore } from "../../stores/authStore"
import { Button } from "../ui/Button"
import { Input } from "../ui/Input"
import { PasswordField } from "./PasswordField"

export function SignupForm() {
  const error = useAuthStore((state) => state.error)
  const message = useAuthStore((state) => state.message)
  const registerMockUser = useAuthStore((state) => state.registerMockUser)
  const setMessage = useAuthStore((state) => state.setMessage)
  const status = useAuthStore((state) => state.status)
  const [blockedMessage, setBlockedMessage] = useState<string | null>(null)
  const [formValues, setFormValues] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  })

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setBlockedMessage(null)
    await registerMockUser(formValues)
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <label className="auth-field">
        <span className="auth-field-label">Kullanıcı Adı</span>
        <Input
          autoComplete="username"
          onChange={(event) => setFormValues({ ...formValues, username: event.target.value })}
          value={formValues.username}
        />
      </label>
      <label className="auth-field">
        <span className="auth-field-label">Mail</span>
        <Input
          autoComplete="email"
          onChange={(event) => setFormValues({ ...formValues, email: event.target.value })}
          type="email"
          value={formValues.email}
        />
      </label>
      <PasswordField
        autoComplete="new-password"
        blockMode="password"
        label="Şifre"
        onBlockedAction={setBlockedMessage}
        onChange={(event) => setFormValues({ ...formValues, password: event.target.value })}
        showRequirements
        value={formValues.password}
      />
      <PasswordField
        autoComplete="new-password"
        blockMode="confirm"
        label="Şifre Onay"
        onBlockedAction={setBlockedMessage}
        onChange={(event) =>
          setFormValues({ ...formValues, confirmPassword: event.target.value })
        }
        value={formValues.confirmPassword}
      />

      <Feedback error={error} message={blockedMessage ?? message} />

      <Button disabled={status === "checking"} type="submit">
        Kaydol
      </Button>

      <button
        className="w-full text-left text-sm text-[var(--color-muted)] underline-offset-4 transition hover:text-black hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
        onClick={() => setMessage("Yoo, hesabın olamaz? Xd")}
        type="button"
      >
        Zaten Hesabın Var Mı?
      </button>
    </form>
  )
}

function Feedback({ error, message }: { error: string | null; message: string | null }) {
  if (error) {
    return (
      <p className="border border-[var(--color-error)]/30 bg-white/60 px-3 py-2 text-sm text-[var(--color-error)]">
        {error}
      </p>
    )
  }

  if (message) {
    return (
      <p className="border border-[var(--color-border)] bg-white/60 px-3 py-2 text-sm text-[var(--color-muted)]">
        {message}
      </p>
    )
  }

  return null
}
