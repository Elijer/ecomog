
import Player from './entities/player.mjs'
import Moss from './entities/moss.mjs'
import { Tile, TerrainTile } from './entities/tiles.mjs'

class GameInstance {
  constructor(rows, cols, io){
    this.rows = rows
    this.cols = cols
    this.players = {}
    this.mosses = {}
    this.grid = this.initializeGrid()
    this.initializeMosses()
    this.io = io
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
    // console.log(player.tileExists(newX, newY))
    if (player.tileExists(newX, newY)){
      player.position = [newX, newY]
      this.grid[x][y][0] = null
      this.grid[newX][newY][0] = player
      this.players[playerId].position = [newX, newY]
    }
  }

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
        console.log(channel)
      }
    })))
  }

  life(){
    for (const [_key, value] of Object.entries(this.mosses)){
      const [x, y] = value.position
      const aMoss = this.grid[x][y][1]
      if (aMoss){
        aMoss.live()
        if (aMoss.dead){
          aMoss.die()
        }
      }
    }
  }
}


export default GameInstance