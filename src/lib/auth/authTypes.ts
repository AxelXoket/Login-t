export type SignupInput = {
  username: string
  email: string
  password: string
  confirmPassword: string
}

export type LoginInput = {
  identifier: string
  password: string
}

export type MockSessionUser = {
  username: string
  email: string
  salt: string
  passwordHash: string
  createdAt: string
}
