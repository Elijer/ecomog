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
    this.players.push(
      {
      name: playerId,
      position: this.assignRandomPoint()
      }
    )
  
    return this.players
  }

  removePlayer(playerId){
    this.players = this.players.filter(player => player.name !== playerId)
    return this.players
  }

}

module.exports = { GameInstance }