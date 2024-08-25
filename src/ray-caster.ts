// src/ray-caster.ts
import { RayCasterSource } from './interfaces'
import Graphics from './graphics'
import {
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
  SQUARE_SIZE,
  DrawStyle
} from './constants'
import Grid from './grid'

class RayCaster {
  private readonly fov: number

  constructor(fov: number = Math.PI / 3) {
    this.fov = fov // Default FOV is 60 degrees (PI / 3 radians)
  }

  public drawRays(
    graphics: Graphics,
    source: RayCasterSource,
    grid: Grid,
    drawStyle = DrawStyle.TopDown
  ): void {
    const numRays = CANVAS_WIDTH
    const halfFov = this.fov / 2
    const step = this.fov / numRays

    const playerX = source.getX()
    const playerY = source.getY()
    const playerDir = source.getDirection()

    for (let i = 0; i < numRays; i++) {
      const rayAngle = playerDir - halfFov + i * step
      const distance = this.getDistanceToWall(playerX, playerY, rayAngle, grid)

      const rayX = playerX + Math.cos(rayAngle) * distance
      const rayY = playerY + Math.sin(rayAngle) * distance

      if (drawStyle === DrawStyle.TopDown) {
        graphics.drawLine(playerX, playerY, rayX, rayY, 'purple')
      } else {
        this.drawDepthPerspective(i, distance, rayAngle, playerDir, graphics)
      }
    }
  }

  private drawDepthPerspective(
    columnIndex: number,
    distance: number,
    rayAngle: number,
    playerDir: number,
    graphics: Graphics
  ) {
    // Depth perspective: draw a vertical line representing the wall slice
    const correctedDistance = distance * Math.cos(rayAngle - playerDir)
    const lineHeight = (SQUARE_SIZE * CANVAS_HEIGHT) / correctedDistance
    const centerY = CANVAS_HEIGHT / 2
    const startY = centerY - lineHeight / 2
    const endY = centerY + lineHeight / 2
    const color = this.calculateColor(distance)
    graphics.drawLine(columnIndex, startY, columnIndex, endY, color)
  }

  private getDistanceToWall(
    playerX: number,
    playerY: number,
    rayAngle: number,
    grid: Grid
  ): number {
    const deltaX = Math.cos(rayAngle)
    const deltaY = Math.sin(rayAngle)

    let gridX = Math.floor(playerX / SQUARE_SIZE)
    let gridY = Math.floor(playerY / SQUARE_SIZE)

    const stepX = deltaX > 0 ? 1 : -1
    const stepY = deltaY > 0 ? 1 : -1

    let sideDistX: number, sideDistY: number
    const deltaDistX = Math.abs(SQUARE_SIZE / deltaX)
    const deltaDistY = Math.abs(SQUARE_SIZE / deltaY)

    if (deltaX > 0) {
      sideDistX = (gridX + 1) * SQUARE_SIZE - playerX
    } else {
      sideDistX = playerX - gridX * SQUARE_SIZE
    }
    sideDistX /= Math.abs(deltaX)

    if (deltaY > 0) {
      sideDistY = (gridY + 1) * SQUARE_SIZE - playerY
    } else {
      sideDistY = playerY - gridY * SQUARE_SIZE
    }
    sideDistY /= Math.abs(deltaY)

    let hit = false
    let distance = 0

    while (!hit) {
      if (sideDistX < sideDistY) {
        gridX += stepX
        distance = sideDistX
        sideDistX += deltaDistX
      } else {
        gridY += stepY
        distance = sideDistY
        sideDistY += deltaDistY
      }

      if (grid.isWall(gridX, gridY)) {
        hit = true
      }
    }

    return distance
  }

  private calculateColor(distance: number): string {
    const maxDistance = 500 // Adjust this value to suit your needs
    const normalizedDistance = Math.min(distance / maxDistance, 1) // Normalize between 0 and 1
    const intensity = 1 - normalizedDistance // Invert to get the correct intensity

    const red = Math.floor(255 * intensity)
    const green = 0 // Keep green and blue as 0 to maintain the red hue
    const blue = 0

    const color = `rgb(${red},${green},${blue})`
    return color
  }
}

export default RayCaster
