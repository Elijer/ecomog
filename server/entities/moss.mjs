import { v4 as uuidv4 } from 'uuid';
import rgbHex from 'rgb-hex';
import { clamp } from '#root/utilities.mjs'
import { Item } from './tiles.mjs'

export default class Moss extends Item {

  static emergence = .0005

  constructor(rows, cols, grid, instances, position, generation = 1){
    super(rows, cols, grid, 1)
    this.instances = instances
    this.grid = grid
    this.position = position && position.length ? position : this.findEmptyPoint()
    this.rgb = [60, 180, 120]
    this.generation = generation
    this.id = uuidv4()

    // Life Cycle
    this.maturity = 0
    this.maturationInterval = 1
    this.youth = 1
    this.maxMaturity = 100
  }

  live(){
    if (this.maturity > this.maxMaturity) this.youth = -2
    this.maturity += this.maturationInterval * this.youth

    // Reproduction
    if (this.maturity % 3 === 0 && this.youth < 0 && this.maturity < 19){
      this.attemptReproduction()
    }
  }

  die(){
    const [x, y] = this.position
    this.grid[x][y][1] =  null
    delete this.instances[this.id]
  }

  attemptReproduction(){
    const viableMove = this.viableMove()
    if (viableMove){
      // Time to get busy
      const newMoss = new Moss(this.rows, this.cols, this.grid, this.instances, viableMove, this.generation + 1)
      const [x, y] = newMoss.position
      this.instances[newMoss.id] = {
        position: [x, y]
      }
      this.grid[x][y][1] = newMoss
    }
  }

  reflect() {
    const computedMaturity = this.maturity / this.maxMaturity
    return '#' + rgbHex(this.rgb[0], this.rgb[1], this.rgb[2], clamp(computedMaturity, 0, 1))
  }

  portableState(){
    return {
      type: this.type,
      color: this.reflect(),
      maturity: this.maturity
    }
  }

  probeSurroundings(){
    const viableMoves = [];
    const directions = [
        [-1,  0], // left
        [ 1,  0], // right
        [ 0, -1], // top
        [ 0,  1], // bottom
        [-1, -1], // top-left
        [ 1, -1], // top-right
        [-1,  1], // bottom-left
        [ 1,  1]  // bottom-right
    ];

    for (const [dx, dy] of directions) {
      const newX = this.position[0] + dx;
      const newY = this.position[1] + dy;
      if (this.tileExists(newX, newY)){
        let occupant = this.grid[newX][newY][1]
        if (!occupant )viableMoves.push([newX, newY, "empty"])
      }
    }
    return viableMoves
  }

  viableMove(){
    const viableMoves = this.probeSurroundings()
    
    if (viableMoves.length === 0) return

    const randomMove = viableMoves[Math.floor(Math.random() * viableMoves.length)]
    return randomMove
  }
}