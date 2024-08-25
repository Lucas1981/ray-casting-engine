// src/grid.ts
import { TileType } from './tile-type'
import { SQUARE_SIZE } from './constants'
import Graphics from './graphics'

class Grid {
  private grid: TileType[][] = []

  public async loadGrid(): Promise<void> {
    try {
      const response = await fetch('dist/assets/grid.json')
      if (!response.ok) {
        throw new Error(`Failed to load grid: ${response.statusText}`)
      }
      const { grid } = await response.json()
      this.grid = grid
    } catch (error) {
      console.error('Failed to load grid:', error)
    }
  }

  // Method to draw the grid using the provided Graphics instance
  public drawGrid(graphics: Graphics): void {
    for (let y = 0; y < this.grid.length; y++) {
      for (let x = 0; x < this.grid[y].length; x++) {
        const tile = this.grid[y][x]
        const color = tile === TileType.Wall ? 'red' : 'blue'

        // Draw the square using the new drawSquare method
        graphics.drawSquare(
          x * SQUARE_SIZE,
          y * SQUARE_SIZE,
          SQUARE_SIZE,
          color
        )
      }
    }
  }

  public isWall(gridX: number, gridY: number): boolean {
    return (
      gridX >= 0 &&
      gridX < this.grid.length &&
      gridY >= 0 &&
      gridY < this.grid[0].length &&
      this.grid[gridY][gridX] === TileType.Wall
    )
  }
}

export default Grid
