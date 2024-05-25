const { v4: uuidv4 } = require('uuid');

const generateRandomPoint = (rows, cols) => {
  return [Math.floor(Math.random() * rows), Math.floor(Math.random() * cols)]
}

class GameInstance {
  constructor(rows, cols){
    this.rows = rows
    this.cols = cols
    this.players = []
  }

  generatePlayerColor = () => {
    return `#${Math.floor(Math.random()*16777215).toString(16)}`
  }

  generateRandomPoint = () => {
    return [Math.floor(Math.random() * this.rows), Math.floor(Math.random() * this.cols)]
  }

  assignRandomPoint(){
    let randomPoint = this.generateRandomPoint()
    for (const player in this.players){
      if (player.position === randomPoint) {
        return this.assignRandomPoint()
      }
    }
  
    return randomPoint
  
  }

  initializePlayer(playerId){
    // The idea was to allow the player to persist, but I need to think about it more
    // I am thinking of maybe added another player field "online"
    // And using that to persist the player data without displaying them
    // But this opens up the possibility of accidentally stacking players
    const playerExists = this.players.some(player => player.id === playerId)
    console.log(playerExists)
    if (playerExists) return this.players

    this.players.push(
      {
      id: playerId,
      position: this.assignRandomPoint(), // to avoid this, I can create an overload of assignRandomPoint
      // That takes the existing position and only reassigns the player if someone else is in it.
      color: this.generatePlayerColor()
      }
    )
  
    return this.players
  }

  removePlayer(playerId){
    console.log("remove player")
    this.players = this.players.filter(player => player.id !== playerId)
    return this.players
  }

}

module.exports = { GameInstance }