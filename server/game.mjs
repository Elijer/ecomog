
import Player from './entities/player.mjs'
import Moss from './entities/moss.mjs'
import Nwa from './entities/nwa.mjs'
import { Tile, TerrainTile } from './entities/tiles.mjs'
import { simplex2Rounded, simplex2, simplexPositive } from './lib/simplex2.mjs'
import { CHANNELS } from './saskanupe_constants.mjs'

class GameInstance {
  constructor(rows, cols){
    this.rows = rows
    this.cols = cols
    this.players = {}
    this.mosses = {}
    this.noiseScale = 30
    this.mineralCapacity = 1
    this.grid = this.initializeGrid()
    this.initializeMosses()
  }

  initializeGrid() {
    const grid = [];
    for (let i = 0; i < this.rows; i++) {
      const row = [];
      for (let j = 0; j < this.cols; j++) {
        let result = simplexPositive(i, j, this.noiseScale) * this.mineralCapacity
        row.push([
          null, // Player layer
          null, // Moss Layer
          new TerrainTile(result), // Terrain Layer
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

    const [x, y] = this.players[playerId].position
    const player = this.grid[x][y][CHANNELS.player]
    const [mx, my] = move[direction]
    const newX = x + mx
    const newY = y + my
    if (player.tileExists(newX, newY) && this.grid[newX][newY][CHANNELS.moss] === null){
      player.position = [newX, newY]
      this.grid[x][y][CHANNELS.player] = null
      this.grid[newX][newY][CHANNELS.player] = player
      this.players[playerId].position = [newX, newY]
    }
  }

  initializeMosses(){
    const initialMossCount = this.rows * this.cols * Moss.emergence
    for (let i = 0; i < initialMossCount; i++){
      const moss = new Moss(this.rows, this.cols, this.grid, this.mosses, null, 200)
      const [x, y] = moss.position
      this.mosses[moss.id] = {
        position: [x,y]
      }
      this.grid[x][y][CHANNELS.moss] = moss
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

    // For each recorded life form, call the live method for each instance
    for (const x of [this.mosses]){
      for (const [_key, value] of Object.entries(x)){
        const [x, y] = value.position
        const instance = this.grid[x][y][CHANNELS.moss]
        if (instance){
          instance.live()
        }
      }
    }

  }
}


export default GameInstance