export function createSessionSalt(): string {
  const bytes = new Uint8Array(16)
  globalThis.crypto.getRandomValues(bytes)
  return bytesToHex(bytes)
}

export async function hashPassword(password: string, salt: string): Promise<string> {
  const encoder = new TextEncoder()
  const payload = encoder.encode(`${salt}:${password}`)
  const digest = await globalThis.crypto.subtle.digest("SHA-256", payload)
  return bytesToHex(new Uint8Array(digest))
}

export async function comparePassword(
  password: string,
  salt: string,
  expectedHash: string,
): Promise<boolean> {
  const actualHash = await hashPassword(password, salt)
  return actualHash === expectedHash
}

function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("")
}
