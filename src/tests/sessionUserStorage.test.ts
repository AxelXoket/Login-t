import { beforeEach, describe, expect, it } from "vitest"

import { comparePassword, createSessionSalt, hashPassword } from "../lib/auth/mockPasswordHash"
import {
  getMockUser,
  MOCK_USER_STORAGE_KEY,
  saveMockUser,
} from "../lib/auth/sessionUserStorage"

describe("session user storage", () => {
  beforeEach(() => {
    window.sessionStorage.clear()
  })

  it("stores only mock user metadata and never the raw password", async () => {
    const rawPassword = "Aa1!ğbbbbbbbbbbb"
    const salt = createSessionSalt()
    const passwordHash = await hashPassword(rawPassword, salt)

    saveMockUser({
      username: "antiuser",
      email: "anti@example.com",
      salt,
      passwordHash,
      createdAt: "2026-06-04T00:00:00.000Z",
    })

    const storedRaw = window.sessionStorage.getItem(MOCK_USER_STORAGE_KEY)
    const storedUser = getMockUser()

    expect(storedRaw).not.toContain(rawPassword)
    expect(storedUser).toEqual({
      username: "antiuser",
      email: "anti@example.com",
      salt,
      passwordHash,
      createdAt: "2026-06-04T00:00:00.000Z",
    })
    expect(Object.keys(JSON.parse(storedRaw ?? "{}")).sort()).toEqual([
      "createdAt",
      "email",
      "passwordHash",
      "salt",
      "username",
    ])
  })

  it("compares passwords with the stored salt and hash", async () => {
    const salt = createSessionSalt()
    const passwordHash = await hashPassword("Aa1!ğbbbbbbbbbbb", salt)

    await expect(comparePassword("Aa1!ğbbbbbbbbbbb", salt, passwordHash)).resolves.toBe(true)
    await expect(comparePassword("Aa1!ğbbbbbbbbbbc", salt, passwordHash)).resolves.toBe(false)
  })

  it("returns null for corrupt session data", () => {
    window.sessionStorage.setItem(MOCK_USER_STORAGE_KEY, "{nope")

    expect(getMockUser()).toBeNull()
  })
})
