import { z } from "zod"

import type { MockSessionUser } from "./authTypes"

export const MOCK_USER_STORAGE_KEY = "antiux.mockUser"

const mockSessionUserSchema = z.object({
  username: z.string().min(1),
  email: z.string().email(),
  salt: z.string().min(1),
  passwordHash: z.string().min(1),
  createdAt: z.string().min(1),
})

export function saveMockUser(user: MockSessionUser): void {
  window.sessionStorage.setItem(MOCK_USER_STORAGE_KEY, JSON.stringify(user))
}

export function getMockUser(): MockSessionUser | null {
  const rawUser = window.sessionStorage.getItem(MOCK_USER_STORAGE_KEY)

  if (!rawUser) {
    return null
  }

  try {
    const parsed = JSON.parse(rawUser)
    return mockSessionUserSchema.parse(parsed)
  } catch {
    return null
  }
}

export function clearMockUser(): void {
  window.sessionStorage.removeItem(MOCK_USER_STORAGE_KEY)
}
