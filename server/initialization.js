const { v4: uuidv4 } = require('uuid');

const generateRandomPoint = (rows, cols) => {
  return [Math.floor(Math.random() * rows), Math.floor(Math.random() * cols)]
}

class GameInstance {
  constructor(rows, cols){
    this.rows = rows
    this.cols = cols
    this.players = []
    this.moss = []
    this.colorManager = new colorManager()
    this.initializeMoss()
    // console.log(this.moss)
  }

  initializeMoss(){
    const initialMossCount = this.rows * this.cols * Moss.emergence
    for (let i = 0; i < initialMossCount; i++){
      let randomPoint = generateRandomPoint(this.rows, this.cols)
      this.moss.push(new Moss(randomPoint[0], randomPoint[1], this.colorManager))
    }
  }

  life(){
    // Moss
    this.moss.forEach(moss => {
      moss.life()
    })
  }

  generatePlayerColor = () => {
    return `#${Math.floor(Math.random()*16777215).toString(16)}`
  }

  generateRed = () => {
    const redHex = Math.floor(Math.random() * 256).toString(16).padStart(2, '0');
    return `#${redHex}0000`;
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
    const playerExists = this.players.some(player => player.id === playerId)
    console.log(playerExists)
    if (playerExists) return this.players

    this.players.push(
      {
      id: playerId,
      position: this.assignRandomPoint(),
      color: this.generateRed()
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

class Moss {

  static emergence = .01

  constructor(x, y, colorManager){
    this.colorManager = colorManager  
    this.position = [x, y]
    this.maturity = 0
    this.color = "#00ff00"
    this.red = 60
    this.blue = 120
    this.green = 180
    this.maxMaturity = 1
    this.young = 1
  }

  isInDecline(){
    return this.maturity > this.maxMaturity
  }

  life(){
    if (this.isInDecline){
      this.young = -1
    }
    this.maturity += .1 * this.young
  }

  damage(){
    this.maturity -= 2
  }

  reflect(){
    return this.colorManager.rgbToHex(this.red * this.maturity, this.green * this.maturity, this.blue * maturity)
  }
}

class colorManager {
  componentToHex(c){
    const hex = c.toString
    return hex.length == 1 ? "0" + hex : hex;
  }
  
  rgbToHex(r, g, b){
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
  }
  
}

module.exports = { GameInstance }