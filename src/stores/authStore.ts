import { create } from "zustand"

import type { LoginInput, SignupInput } from "../lib/auth/authTypes"
import { comparePassword, createSessionSalt, hashPassword } from "../lib/auth/mockPasswordHash"
import { firstSchemaError, loginSchema, signupSchema } from "../lib/auth/passwordRules"
import { getMockUser, saveMockUser } from "../lib/auth/sessionUserStorage"

export type AuthTab = "login" | "signup"

type AuthStatus = "idle" | "checking" | "registered" | "captcha-ready" | "error"

type AuthStore = {
  activeTab: AuthTab
  status: AuthStatus
  error: string | null
  loginResetVersion: number
  message: string | null
  setActiveTab: (tab: AuthTab) => void
  setMessage: (message: string | null) => void
  clearError: () => void
  resetLoginAfterCaptchaDismissal: () => void
  registerMockUser: (input: SignupInput) => Promise<boolean>
  loginMockUser: (input: LoginInput) => Promise<boolean>
}

export const LOGIN_DISMISSED_MESSAGE =
  "Kaçtın sandın ama giriş de gitti. Baştan doldur bakalım."

export const useAuthStore = create<AuthStore>((set) => ({
  activeTab: "signup",
  status: "idle",
  error: null,
  loginResetVersion: 0,
  message: null,
  setActiveTab: (tab) => set({ activeTab: tab, error: null, message: null, status: "idle" }),
  setMessage: (message) => set({ message, error: null }),
  clearError: () => set({ error: null }),
  resetLoginAfterCaptchaDismissal: () =>
    set((state) => ({
      activeTab: "login",
      error: null,
      loginResetVersion: state.loginResetVersion + 1,
      message: LOGIN_DISMISSED_MESSAGE,
      status: "idle",
    })),
  registerMockUser: async (input) => {
    const parsedInput = signupSchema.safeParse(input)

    if (!parsedInput.success) {
      set({
        status: "error",
        error: firstSchemaError(parsedInput.error),
        message: null,
      })
      return false
    }

    set({ status: "checking", error: null, message: null })

    const salt = createSessionSalt()
    const passwordHash = await hashPassword(parsedInput.data.password, salt)

    saveMockUser({
      username: parsedInput.data.username.trim(),
      email: parsedInput.data.email.trim(),
      salt,
      passwordHash,
      createdAt: new Date().toISOString(),
    })

    set({
      activeTab: "login",
      status: "registered",
      error: null,
      message: "Hesap geçici olarak varmış gibi yapıldı. Şimdi giriş yap.",
    })
    return true
  },
  loginMockUser: async (input) => {
    const parsedInput = loginSchema.safeParse(input)

    if (!parsedInput.success) {
      set({
        status: "error",
        error: firstSchemaError(parsedInput.error),
        message: null,
      })
      return false
    }

    set({ status: "checking", error: null, message: null })

    const mockUser = getMockUser()
    const identifier = parsedInput.data.identifier.trim()

    if (!mockUser || (mockUser.username !== identifier && mockUser.email !== identifier)) {
      set({
        status: "error",
        error: "Bu bilgiler bir şeyleri andırıyor ama yetmedi.",
        message: null,
      })
      return false
    }

    const passwordMatches = await comparePassword(
      parsedInput.data.password,
      mockUser.salt,
      mockUser.passwordHash,
    )

    if (!passwordMatches) {
      set({
        status: "error",
        error: "Şifre yanlış olabilir. Ya da sistem sana güvenmemiş olabilir.",
        message: null,
      })
      return false
    }

    set({
      status: "captcha-ready",
      error: null,
      message: "Captcha phase is ready for the next step.",
    })
    return true
  },
}))
