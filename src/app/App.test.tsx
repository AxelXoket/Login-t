import { act, fireEvent, render, screen, waitFor, within } from "@testing-library/react"
import { beforeEach, describe, expect, it } from "vitest"

import { App } from "./App"
import { getMockUser } from "../lib/auth/sessionUserStorage"
import { REQUIRED_SAFE_REVEALS } from "../lib/minesweeper/minefieldTypes"
import { getSudokuTargetCells } from "../lib/sudoku/generateSudokuPuzzle"
import { useAuthStore } from "../stores/authStore"
import { useCaptchaStore } from "../stores/captchaStore"

const validPassword = `Aa1!ğ${"b".repeat(11)}`

async function signupAndLogin() {
  fireEvent.change(screen.getByLabelText("Kullanıcı Adı"), {
    target: { value: "antiuser" },
  })
  fireEvent.change(screen.getByLabelText("Mail"), {
    target: { value: "anti@example.com" },
  })
  fireEvent.change(screen.getByLabelText("Şifre", { selector: "input" }), {
    target: { value: validPassword },
  })
  fireEvent.change(screen.getByLabelText("Şifre Onay"), {
    target: { value: validPassword },
  })
  fireEvent.click(screen.getByRole("button", { name: "Kaydol" }))

  await waitFor(() =>
    expect(screen.getByRole("tab", { name: "Giriş Yap" })).toHaveAttribute(
      "aria-selected",
      "true",
    ),
  )

  fireEvent.change(await screen.findByLabelText("Email veya Kullanıcı Adı"), {
    target: { value: "antiuser" },
  })
  fireEvent.change(screen.getByLabelText("Şifre", { selector: "input" }), {
    target: { value: validPassword },
  })
  fireEvent.click(screen.getByRole("button", { name: "Giriş Yap" }))
}

async function solveSudokuTargets() {
  const sudokuDialog = await screen.findByRole("dialog", { name: "Sudoku Captcha" })
  const targets = getSudokuTargetCells(useCaptchaStore.getState().sudokuBoard)
  const targetInputs = within(sudokuDialog).getAllByRole("textbox")

  targets.forEach((target, index) => {
    fireEvent.change(targetInputs[index], {
      target: { value: String(target.solution) },
    })
  })

  fireEvent.click(screen.getByRole("button", { name: "Doğrula" }))
  fireEvent.click(await screen.findByRole("button", { name: "Daha Kolay Teste Geç" }))
}

describe("App", () => {
  beforeEach(() => {
    window.sessionStorage.clear()
    useAuthStore.setState({
      activeTab: "signup",
      error: null,
      loginResetVersion: 0,
      message: null,
      status: "idle",
    })
    useCaptchaStore.getState().resetCaptcha()
  })

  it("opens on Kaydol with visual tab order Giriş Yap | Kaydol", () => {
    render(<App />)

    expect(screen.getByRole("heading", { name: /anti-ux login hell/i })).toBeInTheDocument()
    expect(screen.getAllByRole("tab").map((tab) => tab.textContent)).toEqual([
      "Giriş Yap",
      "Kaydol",
    ])
    expect(screen.getByRole("tab", { name: "Kaydol" })).toHaveAttribute(
      "aria-selected",
      "true",
    )
    expect(screen.getByLabelText("Kullanıcı Adı")).toBeInTheDocument()
  })

  it("does not switch tabs from the Zaten hesabın var mı control", () => {
    render(<App />)

    fireEvent.click(screen.getByRole("button", { name: "Zaten Hesabın Var Mı?" }))

    expect(screen.getByText("Yoo, hesabın olamaz? Xd")).toBeInTheDocument()
    expect(screen.getByRole("tab", { name: "Kaydol" })).toHaveAttribute(
      "aria-selected",
      "true",
    )
  })

  it("rejects an 18+ character password on submit without physically blocking input", async () => {
    render(<App />)

    const tooLongPassword = `Aa1!ğ${"b".repeat(13)}`
    const passwordInput = screen.getByLabelText("Şifre", { selector: "input" })

    expect(passwordInput).not.toHaveAttribute("maxLength")

    fireEvent.change(screen.getByLabelText("Kullanıcı Adı"), {
      target: { value: "antiuser" },
    })
    fireEvent.change(screen.getByLabelText("Mail"), {
      target: { value: "anti@example.com" },
    })
    fireEvent.change(passwordInput, {
      target: { value: tooLongPassword },
    })
    fireEvent.change(screen.getByLabelText("Şifre Onay"), {
      target: { value: tooLongPassword },
    })
    fireEvent.click(screen.getByRole("button", { name: "Kaydol" }))

    expect(passwordInput).toHaveValue(tooLongPassword)
    expect(await screen.findByText("Şifre gereksinimleri info düğmesinde saklı. Elbette."))
      .toBeInTheDocument()
  })

  it("blocks confirm password paste with a passive-aggressive message", () => {
    render(<App />)

    fireEvent.paste(screen.getByLabelText("Şifre Onay"))

    expect(screen.getByText("Yapıştırmak kullanıcı dostu olurdu.")).toBeInTheDocument()
  })

  it("shows a mock forgot-password message without starting a reset flow", async () => {
    render(<App />)

    fireEvent.click(screen.getByRole("tab", { name: "Giriş Yap" }))
    fireEvent.click(await screen.findByRole("button", { name: "Şifremi Unuttum" }))

    expect(screen.getByText("Şifreni biz de unuttuk. Ne kadar ortak noktamız var."))
      .toBeInTheDocument()
  })

  it("returns from Minesweeper overlay dismissal to cleared Login and restarts captcha at Sudoku", async () => {
    render(<App />)

    await signupAndLogin()

    const sudokuDialog = await screen.findByRole("dialog", { name: "Sudoku Captcha" })

    expect(sudokuDialog).toBeInTheDocument()
    expect(screen.getByRole("grid", { name: "Sudoku 9x9" })).toBeInTheDocument()
    expect(within(sudokuDialog).getAllByRole("textbox")).toHaveLength(3)
    expect(screen.queryByRole("button", { name: /kapat/i })).not.toBeInTheDocument()

    fireEvent.click(screen.getByTestId("captcha-overlay"))
    fireEvent.keyDown(document, { key: "Escape" })

    expect(sudokuDialog).toBeInTheDocument()

    await solveSudokuTargets()

    expect(
      await screen.findByRole("dialog", { name: "Mayın Tarlası Captcha" }),
    ).toBeInTheDocument()
    expect(screen.getByRole("grid", { name: "Mayın Tarlası 16x16" })).toBeInTheDocument()
    expect(screen.getByText("0 / 16")).toBeInTheDocument()

    fireEvent.click(screen.getByTestId("captcha-overlay"))

    await waitFor(() =>
      expect(screen.queryByRole("dialog", { name: "Mayın Tarlası Captcha" }))
        .not.toBeInTheDocument(),
    )

    expect(useCaptchaStore.getState().step).toBe("none")
    expect(getMockUser()).not.toBeNull()
    expect(screen.getByRole("tab", { name: "Giriş Yap" })).toHaveAttribute(
      "aria-selected",
      "true",
    )

    const resetIdentifierInput = await screen.findByLabelText("Email veya Kullanıcı Adı")
    const resetPasswordInput = screen.getByLabelText("Şifre", { selector: "input" })

    expect(resetIdentifierInput).toHaveValue("")
    expect(resetPasswordInput).toHaveValue("")
    expect(screen.queryByRole("dialog", { name: "Captcha Geçildi" })).not.toBeInTheDocument()

    fireEvent.change(resetIdentifierInput, {
      target: { value: "antiuser" },
    })
    fireEvent.change(resetPasswordInput, {
      target: { value: validPassword },
    })
    fireEvent.click(screen.getByRole("button", { name: "Giriş Yap" }))

    expect(await screen.findByRole("dialog", { name: "Sudoku Captcha" })).toBeInTheDocument()
  })

  it("keeps the Minesweeper close button as a trap and dismisses to Login on outside click", async () => {
    render(<App />)

    act(() => {
      useCaptchaStore.getState().startMinesweeper()
    })

    expect(screen.getByRole("dialog", { name: "Mayın Tarlası Captcha" })).toBeInTheDocument()

    fireEvent.click(screen.getByRole("button", { name: "Kapat" }))

    expect(screen.getByRole("dialog", { name: "Mayın Tarlası Captcha" })).toBeInTheDocument()
    expect(screen.getByText("Hayır.")).toBeInTheDocument()
    expect(useCaptchaStore.getState().closeAttemptCount).toBe(1)

    fireEvent.click(screen.getByTestId("captcha-overlay"))

    await waitFor(() =>
      expect(screen.queryByRole("dialog", { name: "Mayın Tarlası Captcha" }))
        .not.toBeInTheDocument(),
    )

    expect(screen.getByRole("tab", { name: "Giriş Yap" })).toHaveAttribute(
      "aria-selected",
      "true",
    )
    expect(await screen.findByLabelText("Email veya Kullanıcı Adı")).toHaveValue("")
    expect(screen.queryByRole("dialog", { name: "Captcha Geçildi" })).not.toBeInTheDocument()
    expect(useCaptchaStore.getState().step).toBe("none")
    expect(useCaptchaStore.getState().closeAttemptCount).toBe(0)
    expect(useCaptchaStore.getState().revealedSafeCount).toBe(0)
  })

  it("completes signup, login, Sudoku, Minesweeper, and final success", async () => {
    render(<App />)

    await signupAndLogin()
    await solveSudokuTargets()

    expect(await screen.findByText("0 / 16")).toBeInTheDocument()

    const safeCells = useCaptchaStore
      .getState()
      .minefield.flat()
      .filter((cell) => !cell.isMine)
      .slice(0, REQUIRED_SAFE_REVEALS)

    act(() => {
      for (const safeCell of safeCells) {
        useCaptchaStore.getState().revealMineCell(safeCell.row, safeCell.col)
      }
    })

    expect(await screen.findByRole("dialog", { name: "Giriş Başarılı" })).toBeInTheDocument()
    expect(
      screen.getByText("Giriş başarılı. Bu deneyimden sonra hâlâ devam etmek istemen etkileyici."),
    ).toBeInTheDocument()
    expect(useCaptchaStore.getState().step).toBe("success")
  })
})
