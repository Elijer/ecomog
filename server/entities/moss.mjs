import { v4 as uuidv4 } from 'uuid';
import rgbHex from 'rgb-hex';
import { clamp } from '#root/utilities.mjs'
import { Item } from './tiles.mjs'

export default class Moss extends Item {

  static emergence = .01

  constructor(rows, cols, grid, channel = 1, mosses, generation = 1){
    super(rows, cols, grid, channel)
    this.type = "moss"
    this.mosses = mosses
    this.position = this.findEmptyPoint()
    this.rgb = [60, 120, 180]
    this.generation = generation
    this.id = uuidv4()
    this.maturity = .1
    this.dead = false
    this.young = 1
    this.maxMaturity = .9
    this.maturationInterval = .1
    this.grid = grid
  }

  live(){
    
    if (this.maturity += this.maturationInterval * this.young <= 0 && this.young === -1){
      // Check this first to make sure that maturity never goes below 0, which would cause an error with rgbHex
      this.dead = true
      return
    }

    this.maturity += this.maturationInterval * this.young
    if (this.maturity >= this.maxMaturity){
      this.young = -1
    }

    if (this.maturity < .8 && this.maturity > .7 && this.young === 1){
      console.log(`Moss ${this.id} is reproducing.`)
      // this.reproduce()
    }
  }

  die(){
    console.log(`Moss ${this.id} has died.`) 
    const [x, y] = this.position
    this.grid[x][y][1] =  null
    delete this.mosses[this.id]
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

  }

  //   probeSurroundings() {
//     const viableMoves = [];
//     const [x, y] = this.position;
//     const directions = [
//         [-1,  0], // left
//         [ 1,  0], // right
//         [ 0, -1], // top
//         [ 0,  1], // bottom
//         [-1, -1], // top-left
//         [ 1, -1], // top-right
//         [-1,  1], // bottom-left
//         [ 1,  1]  // bottom-right
//     ];

//     for (const [dx, dy] of directions) {
//         const newX = x + dx;
//         const newY = y + dy;
//         if (newX >= 0 && newX < this.board[0] && newY >= 0 && newY < this.board[1]) {
//             viableMoves.push([newX, newY]);
//         }
//     }

//     return viableMoves;
//   }

//   viableMove(){
//     const viableMoves = this.probeSurroundings()
//     const randomMove = viableMoves[Math.floor(Math.random() * viableMoves.length)]
//     return randomMove
//   }
}