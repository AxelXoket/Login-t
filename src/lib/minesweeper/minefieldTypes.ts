export const MINEFIELD_ROWS = 16
export const MINEFIELD_COLS = 16
export const MINE_COUNT = 55
export const REQUIRED_SAFE_REVEALS = 16

export const MINE_FAIL_MESSAGE =
  "Bir mayına bastın. İnsanlar hata yapar ama biz bunu kabul etmiyoruz."

export const MINE_SUCCESS_MESSAGE =
  "Giriş başarılı. Bu deneyimden sonra hâlâ devam etmek istemen etkileyici."

export const CLOSE_ATTEMPT_MESSAGES = [
  "Hayır.",
  "Kapatma girişimin kaydedildi.",
  "Modal biraz daha büyüdü.",
  "Kaçış davranışı bot aktivitesi olarak işaretlendi.",
  "Artık buradayız.",
] as const

export type MinefieldStatus = "idle" | "playing" | "success" | "failed"

export type MineCell = {
  col: number
  isMine: boolean
  isRevealed: boolean
  neighborMines: number
  row: number
}

export type MinefieldBoard = MineCell[][]
