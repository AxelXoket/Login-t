import { useEffect, useRef } from "react"
import type { Application, Graphics } from "pixi.js"

type Dot = {
  x: number
  y: number
  rowY: number
  radius: number
  speed: number
  drift: number
  phase: number
  wrapOffset: number
}

type PointerState = {
  active: boolean
  x: number
  y: number
}

const DOT_PADDING = 72
const MAGNIFIER_RADIUS = 145
const MAX_MAGNIFICATION = 2.8

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

function createSeededRandom(seed: number) {
  let state = seed

  return () => {
    state += 0x6d2b79f5
    let value = state
    value = Math.imul(value ^ (value >>> 15), value | 1)
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61)
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296
  }
}

function getViewportSize() {
  return {
    height: Math.max(window.innerHeight, 320),
    width: Math.max(window.innerWidth, 320),
  }
}

function createDots(width: number, height: number) {
  const random = createSeededRandom(Math.round(width * 13 + height * 17))
  const compact = width < 640
  const spacingX = compact ? 48 : 44
  const spacingY = compact ? 46 : 40
  const dots: Dot[] = []

  for (
    let rowIndex = 0, y = -DOT_PADDING;
    y <= height + DOT_PADDING;
    rowIndex += 1, y += spacingY + (random() - 0.5) * 8
  ) {
    const rowOffset = (random() - 0.5) * spacingX * 2.2 + (rowIndex % 2) * 9

    for (
      let x = -DOT_PADDING + rowOffset;
      x <= width + DOT_PADDING;
      x += spacingX + (random() - 0.5) * 5
    ) {
      const jitterX = (random() - 0.5) * 11
      const jitterY = (random() - 0.5) * 9

      dots.push({
        drift: 3 + random() * 5,
        phase: random() * Math.PI * 2,
        radius: 1.15 + random() * 1.15,
        rowY: y + jitterY,
        speed: 15 + random() * 14,
        wrapOffset: random() * spacingX,
        x: x + jitterX,
        y: y + jitterY,
      })
    }
  }

  return dots
}

function shouldSkipPixiForEnvironment() {
  return (
    typeof window === "undefined" ||
    typeof HTMLCanvasElement === "undefined" ||
    /jsdom/i.test(window.navigator.userAgent)
  )
}

export function DotFieldCanvas() {
  const hostRef = useRef<HTMLDivElement | null>(null)
  const pointerRef = useRef<PointerState>({ active: false, x: 0, y: 0 })

  useEffect(() => {
    if (shouldSkipPixiForEnvironment()) {
      return
    }

    const hostElement = hostRef.current

    if (!hostElement) {
      return
    }

    const mountHost: HTMLDivElement = hostElement
    let app: Application | null = null
    let dots: Dot[] = []
    let graphics: Graphics | null = null
    let resizeFrame = 0
    let reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    let viewport = getViewportSize()
    let isDisposed = false

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)")

    const drawDots = () => {
      if (!graphics) {
        return
      }

      const pointer = pointerRef.current
      const now = performance.now() * 0.001

      graphics.clear()

      for (const dot of dots) {
        let radius = dot.radius
        let drawX = dot.x
        let drawY = dot.y + Math.sin(now * 0.8 + dot.phase) * 0.5

        if (pointer.active) {
          const deltaX = dot.x - pointer.x
          const deltaY = dot.y - pointer.y
          const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY)
          const influence = clamp(1 - distance / MAGNIFIER_RADIUS, 0, 1)

          if (influence > 0) {
            const easedInfluence = influence * influence
            radius *= 1 + easedInfluence * MAX_MAGNIFICATION
            drawX += deltaX * easedInfluence * 0.06
            drawY += deltaY * easedInfluence * 0.06
          }
        }

        graphics.circle(drawX, drawY, radius)
      }

      if (dots.length > 0) {
        graphics.fill({ alpha: 0.78, color: 0x050505 })
      }
    }

    const updateDots = (deltaMS: number) => {
      const seconds = Math.min(deltaMS, 48) / 1000
      const motionScale = reducedMotion ? 0.12 : 1

      for (const dot of dots) {
        dot.x -= dot.speed * seconds * motionScale
        dot.y += dot.drift * seconds * motionScale

        if (dot.x < -DOT_PADDING) {
          dot.x = viewport.width + DOT_PADDING + dot.wrapOffset
          dot.y = dot.rowY + Math.sin(performance.now() * 0.001 + dot.phase) * 2
        }

        if (dot.y > viewport.height + DOT_PADDING) {
          dot.y = -DOT_PADDING
        }
      }
    }

    const resize = () => {
      viewport = getViewportSize()
      dots = createDots(viewport.width, viewport.height)
      app?.renderer.resize(viewport.width, viewport.height)
      drawDots()
    }

    const scheduleResize = () => {
      window.cancelAnimationFrame(resizeFrame)
      resizeFrame = window.requestAnimationFrame(resize)
    }

    const handlePointerMove = (event: PointerEvent) => {
      pointerRef.current = {
        active: true,
        x: event.clientX,
        y: event.clientY,
      }
    }

    const clearPointer = () => {
      pointerRef.current.active = false
    }

    const handleReducedMotionChange = (event: MediaQueryListEvent) => {
      reducedMotion = event.matches
    }

    const tick = (ticker: { deltaMS: number }) => {
      updateDots(ticker.deltaMS)
      drawDots()
    }

    async function mountPixi() {
      const { Application: PixiApplication, Graphics: PixiGraphics } = await import("pixi.js")
      const pixiApp = new PixiApplication()
      app = pixiApp

      try {
        await pixiApp.init({
          antialias: true,
          autoDensity: true,
          backgroundAlpha: 0,
          height: viewport.height,
          resolution: Math.min(window.devicePixelRatio || 1, 2),
          width: viewport.width,
        })
      } catch {
        app = null
        return
      }

      if (isDisposed) {
        pixiApp.destroy({ removeView: true }, { children: true, context: true })
        return
      }

      const canvas = pixiApp.canvas
      canvas.className = "dot-field-canvas"
      canvas.setAttribute("aria-hidden", "true")
      canvas.tabIndex = -1
      mountHost.appendChild(canvas)

      graphics = new PixiGraphics()
      pixiApp.stage.addChild(graphics)
      dots = createDots(viewport.width, viewport.height)
      drawDots()

      window.addEventListener("pointermove", handlePointerMove, { passive: true })
      window.addEventListener("pointerleave", clearPointer)
      window.addEventListener("blur", clearPointer)
      window.addEventListener("resize", scheduleResize)
      mediaQuery.addEventListener("change", handleReducedMotionChange)
      pixiApp.ticker.add(tick)
    }

    void mountPixi()

    return () => {
      isDisposed = true
      window.cancelAnimationFrame(resizeFrame)
      window.removeEventListener("pointermove", handlePointerMove)
      window.removeEventListener("pointerleave", clearPointer)
      window.removeEventListener("blur", clearPointer)
      window.removeEventListener("resize", scheduleResize)
      mediaQuery.removeEventListener("change", handleReducedMotionChange)

      if (app) {
        app.ticker.remove(tick)
        app.destroy(
          { removeView: true },
          { children: true, context: true, texture: true, textureSource: true },
        )
      }
    }
  }, [])

  return <div ref={hostRef} aria-hidden="true" className="dot-field-layer" />
}
