import { generateRandomColor} from '#root/utilities.mjs'
import { Item }  from './tiles.mjs'

export default class Player extends Item {
  constructor(id, players, grid, cols, rows){
    super(rows, cols, grid, 0)
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
    // Can find full object through the grid
    this.players[playerId] = {
      position: [x, y],
    }

    // Can use the object to iterate through players
    // this.grid[x][y][0] = {
    //   id: playerId,
    //   position: [x, y],
    //   color: generateRandomColor(),
    //   online: true
    // }
    this.grid[x][y][0] = this

  }

  remove(playerId){
    this.players[playerId].online = false
  }
}