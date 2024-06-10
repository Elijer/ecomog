import { CHANNELS } from "./constants"

export default class God {
  constructor(game, mapConfig){
    this.game = game
    this.sqSize = mapConfig.sqSize

    // Debugging
    this.selectedCell = null
    this.selectedOrganism = null
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
      if (!event.target || !event.target.dataset) return
      let el = event.target
      let elData = el.dataset
      console.log(el.dataset)

      if (elData.nwa){
        this.selectedOrganism = elData.nwa
      }

      if (elData.x && elData.y){
        this.selectedCell = [elData.x, elData.y]
      } else {
        this.selectedCell = null
      }
    })

  }

  printOrganismData = (grid) => {
    if (this.selectedOrganism){
      // TODO: Okay so I have the location, which I already had, but I need to expose whatever information about that organism
      if (this.game.nwas[this.selectedOrganism]){
        console.log(this.game.nwas[this.selectedOrganism])
      }
    }
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
      if (grid[x][y] && grid[x][y][CHANNELS.moss]) {
        popup.style.display = "block"
        popupX.innerHTML = `x: ${x}`
        popupY.innerHTML = `y: ${y}`
        popupEnergy.innerHTML = `lifeForce: ${grid[x][y][CHANNELS.moss].energy}e`
        popupLegacyEnergy.innerHTML = `inherited: ${grid[x][y][CHANNELS.moss].legacyEnergy}e`
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
        if (game.grid[x][y][CHANNELS.nwa] && game.grid[x][y][CHANNELS.nwa].id){
          sq.setAttribute("data-nwa", game.grid[x][y][CHANNELS.nwa].id)
        }
        let tile = game.grid[x][y]

        if (this.selectedCell){
          if (parseInt(this.selectedCell[0]) === parseInt(x) && parseInt(this.selectedCell[1]) == parseInt(y)){
            sq.style.border = ".1px solid white"
          } else {
            sq.style.border = ".1px solid rgba(255, 255, 255, .1)"
          }
        }

        if (tile[CHANNELS.player]){
           sq.style.backgroundColor = tile[CHANNELS.player].color
        } else if (tile[CHANNELS.moss]) {
          sq.style.backgroundColor = tile[CHANNELS.moss].color
        } else if (tile[CHANNELS.nwa]){
          sq.style.backgroundColor = tile[CHANNELS.nwa].color
        } else {
          sq.style.backgroundColor = tile[CHANNELS.terrain].color
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