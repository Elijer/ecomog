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

        for (let i=0; i++; i < 4){
          sq.style.backgroundColor = this.game.grid[x][y][i].color
        }
        
        row.appendChild(sq);
      }
      box.appendChild(row);
    }
  }

  letTimeFlow(game){
    for (let y = 0; y < game.rows - 1; y++) {
      for (let x = 0; x < game.cols - 1; x++) {
        let sq = document.getElementById(`$sq-${x}-${y}`)
        let tile = game.grid[x][y]
        if (tile[0]){
           sq.style.backgroundColor = tile[0].color
        } else if (tile[1]) {
          sq.style.backgroundColor = tile[1].color

          const popup = document.getElementById('popup')
          const popupX = document.getElementById('popup-x')
          const popupY = document.getElementById('popup-y')
          const popupMaturity = document.getElementById('popup-maturity')

          sq.addEventListener("mouseover", (event) => {
            // console.log(`x: ${x}, y: ${y}`, this.game.grid[x][y])
            popup.style.display = "block"
            popup.style.left = `${event.pageX}px`
            popup.style.top = `${event.pageY}px`
            popupX.innerHTML = `x: ${x}`
            popupY.innerHTML = `y: ${y}`
            popupMaturity.innerHTML = `maturity: ${tile[1].maturity}`
          })
  
          sq.addEventListener("mouseout", (event) => {
            popup.style.display = 'none';
          })

        } else if (tile[3]){
          sq.style.backgroundColor = tile[3].color
        } else {
          sq.style.backgroundColor = tile[2].color
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