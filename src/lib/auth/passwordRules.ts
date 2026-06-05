import { z } from "zod"

export const PASSWORD_SPECIAL_CHARACTERS = "!?@#$%&*.,_-"
export const PASSWORD_TURKISH_CHARACTERS = "ğüşıöçĞÜŞİÖÇ"

export type PasswordRuleKey =
  | "minLength"
  | "maxLength"
  | "uppercase"
  | "lowercase"
  | "number"
  | "special"
  | "turkish"

export type PasswordRuleResult = {
  rules: Record<PasswordRuleKey, boolean>
  isValid: boolean
}

export const signupSchema = z
  .object({
    username: z.string().trim().min(1, "Kullanıcı adı boş kalınca sistem huzursuz oluyor."),
    email: z.string().trim().email("Mail adresi mail gibi davranmalı."),
    password: z.string(),
    confirmPassword: z.string(),
  })
  .superRefine((input, ctx) => {
    if (!validatePassword(input.password).isValid) {
      ctx.addIssue({
        code: "custom",
        message: "Şifre gereksinimleri info düğmesinde saklı. Elbette.",
        path: ["password"],
      })
    }

    if (input.password !== input.confirmPassword) {
      ctx.addIssue({
        code: "custom",
        message: "Şifre onayı ezbere yazılmalıydı.",
        path: ["confirmPassword"],
      })
    }
  })

export const loginSchema = z.object({
  identifier: z.string().trim().min(1, "Kimi kontrol edeceğimizi söylemen gerekiyor."),
  password: z.string().min(1, "Şifresiz giriş fikri fazla kullanıcı dostu."),
})

export function validatePassword(password: string): PasswordRuleResult {
  const rules: Record<PasswordRuleKey, boolean> = {
    minLength: password.length >= 16,
    maxLength: password.length <= 17,
    uppercase: /[A-ZÇĞİÖŞÜ]/.test(password),
    lowercase: /[a-zçğıöşü]/.test(password),
    number: /\d/.test(password),
    special: /[!?@#$%&*.,_-]/.test(password),
    turkish: /[ğüşıöçĞÜŞİÖÇ]/.test(password),
  }

  return {
    rules,
    isValid: Object.values(rules).every(Boolean),
  }
}

export const passwordRequirementLabels: Array<{ key: PasswordRuleKey; label: string }> = [
  { key: "minLength", label: "En az 16 karakter" },
  { key: "maxLength", label: "En fazla karakter ?" },
  { key: "uppercase", label: "En az 1 büyük harf" },
  { key: "lowercase", label: "En az 1 küçük harf" },
  { key: "number", label: "En az 1 sayı" },
  {
    key: "special",
    label: `En az 1 normal özel karakter: ${PASSWORD_SPECIAL_CHARACTERS}`,
  },
  {
    key: "turkish",
    label: `En az 1 Türkçe karakter: ${PASSWORD_TURKISH_CHARACTERS}`,
  },
]

export function firstSchemaError(error: z.ZodError): string {
  return error.issues[0]?.message ?? "Form bu haliyle içimize sinmedi."
}
