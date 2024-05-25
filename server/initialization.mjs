import rgbHex from 'rgb-hex';

const generateRandomPoint = (rows, cols) => {
  return [Math.floor(Math.random() * rows), Math.floor(Math.random() * cols)]
}

class GameInstance {
  constructor(rows, cols){
    this.rows = rows
    this.cols = cols
    this.players = []
    this.moss = []
    this.initializeMoss()
  }

  initializeMoss(){
    const initialMossCount = this.rows * this.cols * Moss.emergence
    for (let i = 0; i < initialMossCount; i++){
      let randomPoint = generateRandomPoint(this.rows, this.cols)
      this.moss.push(new Moss(randomPoint[0], randomPoint[1], [this.rows, this.cols]))
    }
  }

  life(){
    // Moss
    this.moss.forEach(aMoss => {
      aMoss.life()
      if (aMoss.dead){
        this.moss = this.moss.filter(moss => moss !== aMoss)
      }

      if (aMoss.maturity < .8 && aMoss.maturity > .7 && aMoss.young === 1 && aMoss.dead === false){
        // console.log(aMoss.probeSurroundings())
        // console.log(aMoss.viableMove())
        const move = aMoss.viableMove()
        this.moss.push(new Moss(move[0], move[1],[this.rows, this.cols]))
      }
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

  portableState(){
    return {
      rows: this.rows,
      cols: this.cols,
      players: this.players,
      moss: this.moss.map(moss => moss.portableState()) // Use map instead of forEach
    }
  }

}

class Moss {

  static emergence = .01

  constructor(x, y, board){
    this.position = [x, y]
    this.maturity = 0.1
    this.red = 60
    this.blue = 120
    this.green = 180
    this.color = this.reflect()
    this.maxMaturity = .9
    this.young = 1
    this.dead = false
    this.board = board
  }

  isInDecline(){
    return this.maturity > this.maxMaturity
  }

  life(){
    if (this.maturity === 7){
      //
    }
    this.maturity += .1 * this.young
    if (this.maturity > this.maxMaturity){
      this.young = -1
      this.maturity = 1
    }

    if (this.maturity < 0){
      this.dead = true
    }
  }

  damage(){
    this.maturity -= 2
  }

  reflect() {
    // Because negative values or those above 1 will cause an error with rbga, we have to clamp them
    return '#' + rgbHex(this.red, this.green, this.blue, clamp(this.maturity, 0, 1))
  }
  
  portableState(){
    return {
      position: this.position,
      color: this.reflect(),
    }
  }

  probeSurroundings() {
    const viableMoves = [];
    const [x, y] = this.position;
    const directions = [
        [-1,  0], // left
        [ 1,  0], // right
        [ 0, -1], // top
        [ 0,  1], // bottom
        [-1, -1], // top-left
        [ 1, -1], // top-right
        [-1,  1], // bottom-left
        [ 1,  1]  // bottom-right
    ];

    for (const [dx, dy] of directions) {
        const newX = x + dx;
        const newY = y + dy;
        if (newX >= 0 && newX < this.board[0] && newY >= 0 && newY < this.board[1]) {
            viableMoves.push([newX, newY]);
        }
    }

    return viableMoves;
  }

  viableMove(){
    const viableMoves = this.probeSurroundings()
    const randomMove = viableMoves[Math.floor(Math.random() * viableMoves.length)]
    return randomMove
  }
}

const clamp = (value, min, max)=>  {
  return Math.max(min, Math.min(max, value));
}

export default GameInstance