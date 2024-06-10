
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
    this.nwas = {}
    this.mosses = {}
    this.noiseScale = 30
    this.mineralCapacity = 1
    this.grid = this.initializeGrid()

    this.lifeMap = {
      nwas: {
        list: this.nwas,
        channel: CHANNELS.nwa,
        obj: Nwa
      },
      mosses: {
        list: this.mosses,
        channel: CHANNELS.moss,
        obj: Moss
      }
    }

    this.initializeOrganisms()
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

  initializeOrganisms(){
    for (const [key, value] of Object.entries(this.lifeMap)){
      const organismCount = this.rows * this.cols * value.obj.emergence
      // console.log(organismCount)
      for (let i = 0; i < organismCount; i++){
        const organism = new value.obj(this.rows, this.cols, this.grid, value.list, null, 200)
        const [x, y] = organism.position
        value.list[organism.id] = {
          position: [x,y]
        }
        this.grid[x][y][value.channel] = organism
      }
    }
  }


  portableState(){
    return {
      rows: this.rows,
      cols: this.cols,
      grid: this.convertGridToPortableState(),
      nwas: this.nwas,
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

  life(frame){

    // For each recorded life form, call the live method for each instance
    for (const [organism, organismValue] of Object.entries(this.lifeMap)){
      for (const [_key, pointer] of Object.entries(organismValue.list)){
        const [x, y] = pointer.position
        const instance = this.grid[x][y][organismValue.channel]
        if (instance){
          instance.live(frame)
        }
      }
    }
  }
}


export default GameInstance