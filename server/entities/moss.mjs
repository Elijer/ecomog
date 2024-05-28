import { v4 as uuidv4 } from 'uuid';
import rgbHex from 'rgb-hex';
import { clamp } from '#root/utilities.mjs'
import { Item } from './tiles.mjs'

export default class Moss extends Item {

  static emergence = .01

  constructor(rows, cols, grid, mosses, position, generation = 1){
    super(rows, cols, grid, 1)
    this.type = "moss"
    this.mosses = mosses
    // Consider removing this - is this bloat?
    this.position = position && position.length ? position : this.findEmptyPoint()
    this.rgb = [60, 180, 120]
    this.generation = generation
    this.id = uuidv4()
    this.maturity = .5 // seems to be6the lowest value that we can really get something with with rgbHex
    this.dead = false
    this.youth = 1
    this.maxMaturity = 1
    this.maturationInterval = .1
    // Consider removing this --- is this bloat?
    this.grid = grid
  }

  live(){

    this.maturity += this.maturationInterval * this.youth
    if (this.maturity > this.maxMaturity){
      this.youth = -1
      this.maturity = 1
    }

    if (this.maturity < 0){
      this.dead = true
    }

    // if (this.youth === -1 && this.maturity <= .01) this.die()
    // this.maturity += this.maturationInterval * this.youth
    // if (this.maturity >= .8){
    //   this.attemptReproduction()
    // }
    // if (this.maturity >= this.maxMaturity) this.youth = -1.1
    // const neighbors = this.probeSurroundings().filter(move => move[2] === "occupied")
    // if (this.maturity >= .6 && neighbors.length >= 3 ){
    //   this.reproductive === false
    // }
  }

  die(){
    const [x, y] = this.position
    this.grid[x][y][1] =  null
    delete this.mosses[this.id]
  }

  isInDecline(){
    return this.maturity > this.maxMaturity
  }

  attemptReproduction(){
    // console.log("Attempting Reproduction")
    const viableMove = this.viableMove()
    if (viableMove){
      // Time to get busy
      const newMoss = new Moss(this.rows, this.cols, this.grid, this.mosses, viableMove, this.generation + 1)
      const [x, y] = newMoss.position
      this.mosses[newMoss.id] = {
        position: [x, y]
      }
      this.grid[x][y][1] = newMoss
    }
  }

  reflect() {
    return '#' + rgbHex(this.rgb[0], this.rgb[1], this.rgb[2], clamp(this.maturity, 0, 1))
  }

  portableState(){
    return {
      type: this.type,
      color: this.reflect()
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
      if (newX >= 0 && newX < this.cols -1 && newY >= 0 && newY < this.rows -1){
        let occupant = this.grid[newX][newY][1]
        let move = [newX, newY, occupant ? "occupied" : "empty"]
        viableMoves.push(move)
      }
    }
    return viableMoves
  }

  // For deterministic behavior, viable moves shouldn't be random but instead rely on something attemptReproductionable
  // For example, the terrain - terrain on map with a higher value could be prioritized
  // Then, if this isn't enough, the next square in that direction could be calculated as well, and so on (this would rarely be necessary), but would break ties
  viableMove(){
    console.log("Starter", this.position)
    // const viableMoves = this.probeSurroundings().filter(move => move[2] === "empty")
    const viableMoves = this.probeSurroundings()
    if (viableMoves.length === 0) {
      return null
    }
    const randomMove = viableMoves[Math.floor(Math.random() * viableMoves.length)]
    console.log("ender", randomMove)
    return randomMove
  }
}