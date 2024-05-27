export default class God {
  constructor(game, mapConfig){
    this.game = game
    this.sqSize = mapConfig.sqSize
  }

  createWorld(){
    let box = document.getElementById('box')
    box.innerHTML = ''
    for (let y = 0; y < this.game.rows; y++) {
      let row = document.createElement('div')
      for (let x = 0; x < this.game.cols; x++) {
        let sq = this.createSq(this.sqSize)
        sq.id = `$sq-${x}-${y}`

        // Player channel
        if (this.game.grid[x][y][0]){
          sq.style.backgroundColor = this.game.grid[x][y][0].color
        } else if (this.game.grid[x][y][1]){
          sq.style.backgroundColor = this.game.grid[x][y][1].color
        } else {
          sq.style.backgroundColor = this.game.grid[x][y][2].color
        }
        row.appendChild(sq);
      }
      box.appendChild(row);
    }
  }

  letTimeFlow(game){
    for (let y = 0; y < game.rows; y++) {
      for (let x = 0; x < game.cols; x++) {
        const moss = game.grid[x][y][1];
        if (moss !== null) {
          let sq = document.getElementById(`$sq-${x}-${y}`)
          sq.style.backgroundColor = moss.color;
        }
      }
    }
  }

  createSq(sqSize){
    let sq = document.createElement("div");
    sq.classList.add("sq");
    sq.style.cssText = `
      padding: ${sqSize}px;
      width: ${sqSize}px;
      height: ${sqSize}px;
      font-size: 10px;
      text-align: center;
    `;
    return sq;
  }

  // getPlayerAtPosition(x, y) {
  //   for (let player of this.game.players) {
  //     if (player.position[0] === x && player.position[1] === y) {
  //       return player;
  //     }
  //   }
  //   return null;
  // }
}