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
    for (const [key, value] of Object.entries(this.mosses)){
      const [x, y] = value.position
      const aMoss = this.grid[x][y][1]
      if (aMoss){
        aMoss.live()
      }
    }
  }
}


export default GameInstance