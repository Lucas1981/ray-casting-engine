import { CANVAS_WIDTH, CANVAS_HEIGHT } from './constants'

class Graphics {
  private canvas: HTMLCanvasElement
  private context: CanvasRenderingContext2D

  constructor() {
    const canvasElement = document.getElementById('canvas') as HTMLCanvasElement
    if (!canvasElement) {
      throw new Error("Canvas element with id 'canvas' not found")
    }

    this.canvas = canvasElement
    this.canvas.width = CANVAS_WIDTH
    this.canvas.height = CANVAS_HEIGHT

    const ctx = this.canvas.getContext('2d')
    if (!ctx) {
      throw new Error('Unable to get 2D context from canvas')
    }

    this.context = ctx
  }

  public startMainLoop(
    updateCallback: () => void,
    renderCallback: (updateTime: number) => void
  ): void {
    const FPS = 60
    const FRAME_DURATION = 1000 / FPS
    let lastFrameTime = performance.now()
    let accumulatedTime = 0

    const loop = (currentTime: number) => {
      const deltaTime = currentTime - lastFrameTime
      lastFrameTime = currentTime
      accumulatedTime += deltaTime

      // Update as many times as necessary to catch up
      while (accumulatedTime >= FRAME_DURATION) {
        updateCallback() // Fixed update step, no need for deltaTime
        accumulatedTime -= FRAME_DURATION
      }

      renderCallback(deltaTime) // Render once per frame

      requestAnimationFrame(loop) // Schedule the next frame
    }

    requestAnimationFrame(loop)
  }

  public drawRect(
    x: number,
    y: number,
    w: number,
    h: number,
    color: string = 'black'
  ): void {
    this.context.fillStyle = color
    this.context.fillRect(x, y, w, h)
  }

  public drawSquare(x: number, y: number, size: number, color: string): void {
    this.context.fillStyle = color
    this.context.fillRect(x, y, size, size)
  }

  // Method to draw a triangle
  public drawTriangle(
    x: number,
    y: number,
    size: number,
    direction: number,
    color: string
  ): void {
    const halfSize = size / 2

    this.context.fillStyle = color
    this.context.beginPath()

    // Move to the top point of the triangle
    this.context.moveTo(
      x + halfSize * Math.cos(direction),
      y + halfSize * Math.sin(direction)
    )

    // Draw the other two points
    this.context.lineTo(
      x + halfSize * Math.cos(direction + (2 * Math.PI) / 3),
      y + halfSize * Math.sin(direction + (2 * Math.PI) / 3)
    )

    this.context.lineTo(
      x + halfSize * Math.cos(direction + (4 * Math.PI) / 3),
      y + halfSize * Math.sin(direction + (4 * Math.PI) / 3)
    )

    this.context.closePath()
    this.context.fill()
  }

  // Method to draw text on the canvas
  public drawText(
    x: number,
    y: number,
    text: string,
    color: string = 'white',
    alignment: 'left' | 'center' | 'right' = 'left'
  ): void {
    this.context.fillStyle = color
    this.context.textAlign = alignment
    this.context.textBaseline = 'middle' // Set the baseline to middle for better vertical alignment

    this.context.fillText(text, x, y)
  }

  public drawLine(
    sx: number,
    sy: number,
    dx: number,
    dy: number,
    color: string
  ): void {
    this.context.strokeStyle = color
    this.context.beginPath()
    this.context.moveTo(sx, sy)
    this.context.lineTo(dx, dy)
    this.context.stroke()
  }
}

export default Graphics
