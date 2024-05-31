export default class God {
  constructor(game, mapConfig){
    this.game = game
    this.sqSize = mapConfig.sqSize
  }

  createWorld(){
    let box = document.getElementById('box')
    box.innerHTML = ''
    for (let y = 0; y < this.game.rows - 1; y++) {
      let row = document.createElement('div')
      for (let x = 0; x < this.game.cols - 1; x++) {
        let sq = this.createSq(this.sqSize)
        sq.id = `$sq-${x}-${y}`

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
    for (let y = 0; y < game.rows - 1; y++) {
      for (let x = 0; x < game.cols - 1; x++) {
        if (game.grid[x][y][0]) {
          const player = game.grid[x][y][0];
          let sq = document.getElementById(`$sq-${x}-${y}`)
          sq.style.backgroundColor = player.color;
        } else if (game.grid[x][y][1]) {
          const moss = game.grid[x][y][1];
          let sq = document.getElementById(`$sq-${x}-${y}`)
          sq.style.backgroundColor = moss.color;
        } else if (game.grid[x][y][2]){
          const terrain = game.grid[x][y][2];
          let sq = document.getElementById(`$sq-${x}-${y}`)
          sq.style.backgroundColor = terrain.color;
        } else {
          let sq = document.getElementById(`$sq-${x}-${y}`)
          sq.style.backgroundColor = "black"
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