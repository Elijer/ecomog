export default class God {
  constructor(game, mapConfig){
    this.game = game
    this.sqSize = mapConfig.sqSize

    // Debugging
    this.selectedCell = null
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

    // Listen for mouse events
    box.addEventListener("click", (event) => {
      console.log(event)
      if (!event.target || !event.target.dataset) return
      let el = event.target
      let elData = el.dataset
      if (elData.x && elData.y){
        this.selectedCell = [elData.x, elData.y]
      } else {
        this.selectedCell = null
      }
    })

  }

  printCellData = (grid) => {

    const popup = document.getElementById('popup');
    const popupX = document.getElementById('popup-x');
    const popupY = document.getElementById('popup-y');
    const popupEnergy = document.getElementById('popup-energy');
    const popupLegacyEnergy = document.getElementById('popup-legacy-energy');
    const cargogen = document.getElementById('popup-cargogen');
    
    if (this.selectedCell){
      const [x, y] = this.selectedCell
      if (grid[x][y] && grid[x][y][1]) {
        popup.style.display = "block"
        popupX.innerHTML = `x: ${x}`
        popupY.innerHTML = `y: ${y}`
        popupEnergy.innerHTML = `lifeForce: ${grid[x][y][1].energy}e`
        popupLegacyEnergy.innerHTML = `inherited: ${grid[x][y][1].legacyEnergy}e`
        cargogen.innerHTML = `${grid[x][y][2].cargogen}Cg`
      } else {
        popup.style.display = "none"
      }
    }
  }

  letTimeFlow(game){

    for (let y = 0; y < game.rows - 1; y++) {
      for (let x = 0; x < game.cols - 1; x++) {
        let sq = document.getElementById(`$sq-${x}-${y}`)
        sq.setAttribute("data-x", x)
        sq.setAttribute("data-y", y)
        let tile = game.grid[x][y]

        if (this.selectedCell){
          if (parseInt(this.selectedCell[0]) === parseInt(x) && parseInt(this.selectedCell[1]) == parseInt(y)){
            sq.style.border = ".1px solid white"
          } else {
            sq.style.border = ".1px solid rgba(255, 255, 255, .1)"
          }
        }

        if (tile[0]){
           sq.style.backgroundColor = tile[0].color
        } else if (tile[1]) {
          sq.style.backgroundColor = tile[1].color
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

}