import { describe, expect, it } from "vitest"

import { validatePassword } from "../lib/auth/passwordRules"

const validPassword = (length: 16 | 17) => `Aa1!ğ${"b".repeat(length - 5)}`

describe("password rules", () => {
  it("accepts 16 and 17 character passwords when every rule is met", () => {
    expect(validatePassword(validPassword(16)).isValid).toBe(true)
    expect(validatePassword(validPassword(17)).isValid).toBe(true)
  })

  it("rejects passwords that are too short or too long", () => {
    expect(validatePassword(`Aa1!ğ${"b".repeat(10)}`).rules.minLength).toBe(false)
    expect(validatePassword(`Aa1!ğ${"b".repeat(13)}`).rules.maxLength).toBe(false)
    expect(validatePassword(`Aa1!ğ${"b".repeat(13)}`).isValid).toBe(false)
  })

  it("rejects missing uppercase, lowercase, number, special, or Turkish characters", () => {
    expect(validatePassword(`aa1!ğ${"b".repeat(11)}`).rules.uppercase).toBe(false)
    expect(validatePassword(`AA1!Ğ${"B".repeat(11)}`).rules.lowercase).toBe(false)
    expect(validatePassword(`AaA!ğ${"b".repeat(11)}`).rules.number).toBe(false)
    expect(validatePassword(`Aa12ğ${"b".repeat(11)}`).rules.special).toBe(false)
    expect(validatePassword(`Aa1!x${"b".repeat(11)}`).rules.turkish).toBe(false)
  })
})
