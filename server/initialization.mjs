/*
Refactor:
- How to handle empty tiles - with null? Or some sort of empty object?
- Portable state should probably be a single method that is ineherited by everyone
- All I am actually sending right now is color, so it might actually be worth it to get rid of channels for now?
- In any case, each item only needs to return a color actually, and even if I keep channels
- The channels have precedence, so I could, to the client, just send one color per cell, even if there are channels on the server
*/

import Player from './entities/player.mjs'
import Moss from './entities/moss.mjs'
import { Tile, TerrainTile } from './entities/tiles.mjs'

class GameInstance {
  constructor(rows, cols){
    this.rows = rows
    this.cols = cols
    this.players = {}
    this.mosses = {}
    this.grid = this.initializeGrid()
    this.initializeMosses()
  }

  initializeGrid() {
    const grid = [];
    for (let i = 0; i < this.rows; i++) {
      const row = [];
      for (let j = 0; j < this.cols; j++) {
        row.push([null, null, new TerrainTile()]); // Create a new array for each cell
      }
      grid.push(row);
    }
    return grid;
  }

  initializePlayer(playerId){
    const player = new Player(playerId, this.players, this.grid, this.cols, this.rows)
    player.initialize()
  }

  initializeMosses(){
    const initialMossCount = this.rows * this.cols * Moss.emergence
    for (let i = 0; i < initialMossCount; i++){
      const moss = new Moss(this.rows, this.cols, this.grid, 1, this.mosses)
      const [x, y] = moss.position
      this.mosses[moss.id] = {
        position: [x,y]
      }
      this.grid[x][y][1] = moss
    }
  }

  portableState(){
    return {
      rows: this.rows,
      cols: this.cols,
      grid: this.convertGridToPortableState()
    }
  }

  convertGridToPortableState(){
    return this.grid.map(row => row.map(cell => cell.map(channel => {
      if (channel === null) return null
      try {
        return channel.portableState()
      } catch (error) {
        console.log("There was an error with the following channel")
        console.log(channel)
      }
    })))
  }

  life(){
    // Iterate through moss object more efficient than traversing grid
    for (const [key, value] of Object.entries(this.mosses)){
      const [x, y] = value.position
      // try {
        const aMoss = this.grid[x][y][1]
        aMoss.die()

      if (aMoss.dead){

        // TODO: Double check that both parts of deletion are working
        aMoss.die()
        // delete this.moss[key]
        // this.grid[value.x][value.y][1] =  null
        return
      }



      aMoss.live()
        // console.log("THere was a problem with")
        // console.log(aMoss)
      // if (aMoss.maturity < .8 && aMoss.maturity > .7 && aMoss.young === 1 && aMoss.dead === false){
      //   const move = aMoss.viableMove()
      //   this.grid[move[0]][move[1]][1] = new Moss(move[0], move[1],[this.rows, this.cols], aMoss.generation + 1)
      //   this.moss[this.grid[move[0]][move[1]][1].id] = {
      //     x: move[0],
      //     y: move[1]
      //   }
      // }
    }
  }
}


  // initializeMoss(){
  //   // Moss emergency refers to the percentage of the board that will be initially covered in moss
  //   const initialMossCount = this.rows * this.cols * Moss.emergence
  //   for (let i = 0; i < initialMossCount; i++){
  //     let randomPoint = this.generateRandomPoint()
  //     // let [pointX, pointY ] = this.generateRandomPoint()
  //     let pointX = randomPoint[0]
  //     let pointY = randomPoint[1]
  //     this.grid[pointX][pointY][1] = new Moss(pointX, pointY, [this.rows, this.cols], 1)
  //     this.moss[this.grid[pointX][pointY][1].id] = {
  //       x: pointX,
  //       y: pointY,
  //     }
  //   }
  // }

  // life(){
  //   // Iterate through moss object more efficient than traversing grid
  //   for (const [key, value] of Object.entries(this.moss)){
      
  //     const aMoss = this.grid[value.x][value.y][1]

  //     if (aMoss.dead){
  //       this.grid[value.x][value.y][1] = new TerrainTile()
  //       delete this.moss[key]
  //       return
  //     }

  //     try {
  //       aMoss.life()
  //     } catch (error) {
  //       console.log("THere was a problem with")
  //       console.log(aMoss)
  //     }
  //     if (aMoss.maturity < .8 && aMoss.maturity > .7 && aMoss.young === 1 && aMoss.dead === false){
  //       const move = aMoss.viableMove()
  //       this.grid[move[0]][move[1]][1] = new Moss(move[0], move[1],[this.rows, this.cols], aMoss.generation + 1)
  //       this.moss[this.grid[move[0]][move[1]][1].id] = {
  //         x: move[0],
  //         y: move[1]
  //       }
  //     }
  //   }
  // }

  // generateRandomPoint = () => {
  //   return [Math.floor(Math.random() * this.rows), Math.floor(Math.random() * this.cols)]
  // }

  // assignRandomPoint(){
  //   let randomPoint = this.generateRandomPoint(this.rows, this.cols)
  //   for (const player in this.players){
  //     if (player.position === randomPoint) {
  //       return this.assignRandomPoint()
  //     }
  //   }
  
  //   return randomPoint
  
  // }

  // initializePlayer(playerId){
  //   const playerExists = this.players.some(player => player.id === playerId)
  //   if (playerExists) return this.players

  //   this.players.push(
  //     {
  //     id: playerId,
  //     position: this.assignRandomPoint(),
  //     color: generateRed()
  //     }
  //   )
  
  //   return this.players
  // }

  // removePlayer(playerId){
  //   console.log("remove player")
  //   this.players = this.players.filter(player => player.id !== playerId)
  //   return this.players
  // }

  // portableState(){
  //   console.log(this.grid)
  //   return {
  //     rows: this.rows,
  //     cols: this.cols,
  //     players: this.players,
  //     // moss: Object.keys(this.moss).map(key => JSONthis.moss[key].portableState()),
  //     // moss: Object.keys(this.moss).map(key => {
  //     //   this.grid[this.moss[key].x][this.moss[key].y][1].portableState()
  //     // }),
  //     // grid: grid - at some point might want to just return this? It's really most helpful for movement and collision though
  //     grid: this.grid.map(thing => thing.map(otherThing => otherThing.map(thirdThing => thirdThing.portableState())))
  //   }
  // }

// }

// class Moss {

//   static emergence = .01

//   constructor(x, y, board, generation){
//     this.position = [x, y]
//     this.id = uuidv4()
//     this.maturity = 0.1
//     this.red = 60
//     this.blue = 120
//     this.green = 180
//     this.color = this.reflect()
//     this.maxMaturity = .9
//     this.young = 1
//     this.dead = false
//     this.board = board
//     this.generation = generation
//   }

//   isInDecline(){
//     return this.maturity > this.maxMaturity
//   }

//   test(){
//     console.log(this.maturity)
//   }

//   life(){
//     if (this.maturity === 7){
//       //
//     }
//     this.maturity += .1 * this.young
//     if (this.maturity > this.maxMaturity){
//       this.young = -1
//       this.maturity = 1
//     }

//     if (this.maturity < 1){
//       this.dead = true
//     }
//   }

//   damage(){
//     this.maturity -= 2
//   }

//   reflect() {
//     // Because negative values or those above 1 will cause an error with rbga, we have to clamp them
//     return '#' + rgbHex(this.red, this.green, this.blue, clamp(this.maturity, 0, 1))
//   }
  
//   portableState(){
//     return {
//       position: this.position,
//       color: this.reflect(),
//     }
//   }

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
// }

export default GameInstance