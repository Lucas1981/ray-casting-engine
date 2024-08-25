// src/player.ts
import { keys } from './input'
import Graphics from './graphics'
import Grid from './grid'
import { SQUARE_SIZE } from './constants'
import { RayCasterSource } from './interfaces'

class Player implements RayCasterSource {
  private x: number
  private y: number
  private direction: number
  private readonly speed: number
  private readonly rotationSpeed: number
  private grid: Grid

  constructor(initialX: number, initialY: number, grid: Grid) {
    this.x = initialX
    this.y = initialY
    this.direction = 0 // Initially facing right (0 radians)
    this.speed = 2 // Movement speed
    this.rotationSpeed = Math.PI / 120 // Rotation speed
    this.grid = grid // The grid instance
  }

  // Method to update the player's position and direction based on input
  public update(): void {
    this.updateDirections()
    const { nextX, nextY } = this.calculateNextPosition()
    this.handleXCollision(nextX)
    this.handleYCollision(nextY)
  }

  private updateDirections() {
    if (keys.left) {
      this.direction -= this.rotationSpeed
    }
    if (keys.right) {
      this.direction += this.rotationSpeed
    }
  }

  private calculateNextPosition() {
    let nextX = this.x
    let nextY = this.y

    // Calculate next potential x and y positions
    if (keys.up) {
      nextX += this.speed * Math.cos(this.direction)
      nextY += this.speed * Math.sin(this.direction)
    }
    if (keys.down) {
      nextX -= this.speed * Math.cos(this.direction)
      nextY -= this.speed * Math.sin(this.direction)
    }

    return { nextX, nextY }
  }

  private handleXCollision(nextX: number) {
    const gridX = Math.floor(nextX / SQUARE_SIZE)
    const gridY = Math.floor(this.y / SQUARE_SIZE)
    if (!this.grid.isWall(gridX, gridY)) {
      this.x = nextX
    } else {
      const directionX = Math.sign(Math.cos(this.direction))
      if (directionX === 1) {
        this.x = Math.ceil(this.x / SQUARE_SIZE) * SQUARE_SIZE - 1
      } else if (directionX === -1) {
        this.x = Math.floor(this.x / SQUARE_SIZE) * SQUARE_SIZE + 1
      }
    }
  }

  private handleYCollision(nextY: number) {
    const gridX = Math.floor(this.x / SQUARE_SIZE)
    const gridY = Math.floor(nextY / SQUARE_SIZE)
    if (!this.grid.isWall(gridX, gridY)) {
      this.y = nextY
    } else {
      const directionY = Math.sign(Math.sin(this.direction))
      if (directionY === 1) {
        this.y = Math.ceil(this.y / SQUARE_SIZE) * SQUARE_SIZE - 1
      } else if (directionY === -1) {
        this.y = Math.floor(this.y / SQUARE_SIZE) * SQUARE_SIZE + 1
      }
    }
  }

  // Method to draw the player on the canvas
  public draw(graphics: Graphics): void {
    graphics.drawTriangle(this.x, this.y, 20, this.direction, 'green')
  }

  // Implement RayCasterSource interface
  public getX(): number {
    return this.x
  }

  public getY(): number {
    return this.y
  }

  public getDirection(): number {
    return this.direction
  }
}

export default Player
