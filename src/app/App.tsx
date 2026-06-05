import { AuthShell } from "../components/auth/AuthShell"
import { DotFieldCanvas } from "../components/background/DotFieldCanvas"
import { CaptchaLayer } from "../components/captcha/CaptchaLayer"

export function App() {
  return (
    <div className="app-root">
      <DotFieldCanvas />
      <AuthShell />
      <CaptchaLayer />
    </div>
  )
}
