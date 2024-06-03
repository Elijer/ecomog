import { v4 as uuidv4 } from 'uuid';
import rgbHex from 'rgb-hex';
import { clamp } from '#root/utilities.mjs'
import { Item } from './tiles.mjs'

export default class Moss extends Item {

  static emergence = .001

  constructor(rows, cols, grid, nwas, position, generation = 1){
    super(rows, cols, grid, 1)
    this.type = "nwa"
    this.nwas = nwas
    this.grid = grid
    this.position = position && position.length ? position : this.findEmptyPoint()
    this.generation = generation
    this.id = uuidv4()
    this.color = this.nwaColor()

    // Life Cycle
    this.dead = false
    this.maturity = 1
    this.youth = 1
    this.maxMaturity = 500
    this.maturationInterval = 1
  }

  live(){

    //
    if (this.maturity > this.maxMaturity) this.youth = -1
    this.maturity += this.maturationInterval * this.youth

    // Death
    if (this.maturity < this.maturationInterval){
      this.die()
    }

    // Reproduction
    if (this.maturity > 80 && this.maturity < 90){
      this.attemptReproduction()
    }

    // Movement
    // if (this.maturity > 10 && this.maturity < 20){
    console.log("Moving")
    this.moveNwa()
    // }
  }

  moveNwa(){
    const move = {
      left: [0, -1],
      right: [0, 1],
      up: [-1, 0],
      down: [1, 0]
    }

    const randomMove = move[Math.floor(Math.random() * 4)]
    // const player = this.players[playerId]
    const [x, y] = this.nwas[this.id].position
    const nwa = this.grid[x][y][3]
    const [mx, my] = randomMove
    const newX = x + mx
    const newY = y + my
    if (this.tileExists(newX, newY) && this.grid[newX][newY][3] === null){
      this.position = [newX, newY]
      this.grid[x][y][3] = null
      this.grid[newX][newY][3] = nwa
      this.nwas[this.id].position = [newX, newY]
    }
  }

  nwaColor(){
    const lightBrowns = [
      "#f5e0c3", // Very light brown
      "#ecd5b3", // Light brown
      "#e3caa3", // Lighter brown
      "#dabe93", // Light-medium brown
      "#d1b383", // Medium-light brown
      "#c8a873", // Medium brown
      "#bf9d63", // Darker light brown
      "#b69253"  // Dark light brown
    ];
    return lightBrowns[Math.floor(Math.random() * lightBrowns.length)]
  }

  die(){
    const [x, y] = this.position
    this.grid[x][y][1] =  null
    delete this.mosses[this.id]
  }

  attemptReproduction(){
    const viableMove = this.viableMove()
    if (viableMove){
      // Time to get busy
      const newNwa = new Nwa(this.rows, this.cols, this.grid, this.mosses, viableMove, this.generation + 1)
      const [x, y] = newNwa.position
      this.nwas[newNwa.id] = {
        position: [x, y]
      }
      this.grid[x][y][1] = newNwa
    }
  }

  portableState(){
    return {
      type: this.type,
      color: this.color
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
        let move = [newX, newY, occupant ? "occupied" : "empty"]
        viableMoves.push(move)
      }
    }
    return viableMoves
  }

  viableMove(){
    const viableMoves = this.probeSurroundings()
    const occupiedMoves = viableMoves.filter(move => move[2] === "occupied")
    if (occupiedMoves.length > 4){
      this.youth = -1
    }
    if (viableMoves.length === 0) {
      return null
    }
    const randomMove = viableMoves[Math.floor(Math.random() * viableMoves.length)]
    return randomMove
  }
}