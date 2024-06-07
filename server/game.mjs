
import Player from './entities/player.mjs'
import Moss from './entities/moss.mjs'
import Nwa from './entities/nwa.mjs'
import { Tile, TerrainTile } from './entities/tiles.mjs'
import { simplex2Rounded } from './lib/simplex2.mjs'

class GameInstance {
  constructor(rows, cols){
    this.rows = rows
    this.cols = cols
    this.players = {}
    this.mosses = {}
    // this.nwas = {}
    this.grid = this.initializeGrid()
    this.initializeMosses()
    // this.initializeNwas()
  }

  initializeGrid() {
    const grid = [];
    for (let i = 0; i < this.rows; i++) {
      const row = [];
      for (let j = 0; j < this.cols; j++) {
        row.push([
          null, // Player layer
          null, // Moss Layer
          new TerrainTile(simplex2Rounded(i, j)), // Terrain Layer
          null // Nwa layer
        ]);
      }
      grid.push(row);
    }
    return grid;
  }

  initializePlayer(playerId){
    const player = new Player(playerId, this.players, this.grid, this.cols, this.rows)
    player.initialize()
  }

  movePlayer(playerId, direction){
    const move = {
      left: [0, -1],
      right: [0, 1],
      up: [-1, 0],
      down: [1, 0]
    }
    // const player = this.players[playerId]
    const [x, y] = this.players[playerId].position
    const player = this.grid[x][y][0]
    const [mx, my] = move[direction]
    const newX = x + mx
    const newY = y + my
    if (player.tileExists(newX, newY) && this.grid[newX][newY][1] === null){
      player.position = [newX, newY]
      this.grid[x][y][0] = null
      this.grid[newX][newY][0] = player
      this.players[playerId].position = [newX, newY]
    }
  }

  // initializeNwas(){
  //   const initialNwaCount = this.rows * this.cols * Nwa.emergence
  //   for (let i = 0; i < initialNwaCount; i++){
  //     const nwa = new Nwa(this.rows, this.cols, this.grid, this.nwas)
  //     const [x, y] = nwa.position
  //     this.nwas[nwa.id] = {
  //       position: [x,y]
  //     }
  //     this.grid[x][y][3] = nwa
  //   }
  // }

  initializeMosses(){
    // Super weird - when emergence is low, there are initial mosses, but they don't reproduce
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
        console.log(channel.channel)
        console.log(error)
      }
    })))
  }

  life(){
    // for (const [_key, value] of Object.entries(this.nwas)){
    //   const [x, y] = value.position
    //   const aNwa = this.grid[x][y][1]
    //   if (aNwa){
    //     aNwa.live()
    //     if (aNwa.dead){
    //       aNwa.die()
    //     }
    //   }
    // }

    // For each recorded life form, call the live method for each instance
    for (const x of [this.mosses]){
      for (const [_key, value] of Object.entries(x)){
        const [x, y] = value.position
        const instance = this.grid[x][y][1]
        if (instance){
          instance.live()
        }
      }
    }

  }
}


export default GameInstance