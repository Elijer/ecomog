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
      const moss = new Moss(this.rows, this.cols, this.grid, this.mosses)
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
    for (const [key, value] of Object.entries(this.mosses)){
      const [x, y] = value.position
      const aMoss = this.grid[x][y][1]
      
      if (!aMoss) return

      if (aMoss.maturity > .8 && aMoss.maturity < .9 && aMoss.youth === 1 && aMoss.reproCount < 4){
        aMoss.attemptReproduction()
        aMoss.reproCount += 1
      }
  
      aMoss.live()
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


//   damage(){
//     this.maturity -= 2
//   }


export default GameInstance