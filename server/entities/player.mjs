import { generateRandomColor} from '#root/utilities.mjs'
import { Item }  from './tiles.mjs'
import { CHANNELS } from '#root/saskanupe_constants.mjs'

export default class Player extends Item {
  constructor(id, players, grid, cols, rows){
    super(rows, cols, grid, CHANNELS.player)
    this.type = "player"
    this.players = players
    this.id = id
    this.color = generateRandomColor()
  }

  initialize(){
    if (this.players[this.id]){
      this.players[this.id].online = true // TODO: Set online to false when player disconnects
      return
    }

    this.create(this.id)
  }

    // Create a player and assign them a random, empty point on the grid
  create(playerId){
    const [x, y] = this.findEmptyPoint()

    this.players[playerId] = {
      position: [x, y]
    }

    this.grid[x][y][CHANNELS.player] = this

  }

  remove(playerId){
    this.players[playerId].online = false
  }
}