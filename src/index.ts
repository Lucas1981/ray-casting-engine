import Graphics from './graphics'
import Grid from './grid'
import Player from './player'
import RayCaster from './ray-caster'
import { CANVAS_HEIGHT, CANVAS_WIDTH, DrawStyle } from './constants'

const main = async () => {
  try {
    const graphics = new Graphics()
    const grid = new Grid()
    await grid.loadGrid()
    const player = new Player(100, 100, grid)
    const rayCaster = new RayCaster()
    const drawStyle = DrawStyle.DepthPerspective as DrawStyle

    const update = () => {
      player.update()
    }

    // eslint-disable-next-line
    const render = (updateTime: number) => {
      if (drawStyle === DrawStyle.TopDown) {
        grid.drawGrid(graphics)
        player.draw(graphics)
      } else if (drawStyle === DrawStyle.DepthPerspective) {
        graphics.drawRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
      }

      rayCaster.drawRays(graphics, player, grid, drawStyle)

      // DEBUG: output the fps
      // graphics.drawText(
      //   0,
      //   CANVAS_HEIGHT - 120,
      //   `FPS: ${Math.round(1000 / updateTime)}`
      // )
    }

    graphics.startMainLoop(update, render)
  } catch (error) {
    console.error(error)
  }
}

main()
