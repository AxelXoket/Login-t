import { useEffect, useState, type FormEvent } from "react"

import { useAuthStore } from "../../stores/authStore"
import { useCaptchaStore } from "../../stores/captchaStore"
import { Button } from "../ui/Button"
import { Input } from "../ui/Input"
import { PasswordField } from "./PasswordField"

export function LoginForm() {
  const error = useAuthStore((state) => state.error)
  const loginResetVersion = useAuthStore((state) => state.loginResetVersion)
  const loginMockUser = useAuthStore((state) => state.loginMockUser)
  const message = useAuthStore((state) => state.message)
  const setMessage = useAuthStore((state) => state.setMessage)
  const status = useAuthStore((state) => state.status)
  const startSudoku = useCaptchaStore((state) => state.startSudoku)
  const [formValues, setFormValues] = useState({
    identifier: "",
    password: "",
  })

  useEffect(() => {
    setFormValues({
      identifier: "",
      password: "",
    })
  }, [loginResetVersion])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const loggedIn = await loginMockUser(formValues)

    if (loggedIn) {
      startSudoku()
    }
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <label className="auth-field">
        <span className="auth-field-label">Email veya Kullanıcı Adı</span>
        <Input
          autoComplete="username"
          onChange={(event) => setFormValues({ ...formValues, identifier: event.target.value })}
          value={formValues.identifier}
        />
      </label>
      <PasswordField
        autoComplete="current-password"
        label="Şifre"
        onChange={(event) => setFormValues({ ...formValues, password: event.target.value })}
        value={formValues.password}
      />

      <button
        className="text-sm text-[var(--color-muted)] underline-offset-4 transition hover:text-black hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
        onClick={() => setMessage("Şifreni biz de unuttuk. Ne kadar ortak noktamız var.")}
        type="button"
      >
        Şifremi Unuttum
      </button>

      <Feedback error={error} message={message} />

      <Button disabled={status === "checking"} type="submit">
        Giriş Yap
      </Button>
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
