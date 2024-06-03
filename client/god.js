export default class God {
  constructor(game, mapConfig){
    this.game = game
    this.sqSize = mapConfig.sqSize
    this.selectedCell = null

    // Debugging
  }

  // debuggingDisplay(element, tile, x, y, grid){

  //   element.addEventListener("mouseOver", (event) => {
  //     console.log("HEY")
  //     console.log(grid[x][y][1])
  //   })

  //   const popup = document.getElementById('popup')
  //   const popupX = document.getElementById('popup-x')
  //   const popupY = document.getElementById('popup-y')
  //   const popupMaturity = document.getElementById('popup-maturity')

  //   // element.addEventListener("mouseover", (event) => {
  //   //   const updatePopupContent = setInterval(() => {
  //   //     console.log(grid[x][y][1])
  //   //     // popup.style.display = "block"
  //   //     // popupX.innerHTML = `x: ${grid[x][y][1].position[0]}`
  //   //     // popupY.innerHTML = `y: ${grid[x][y][1].position[1]}`
  //   //     // popupMaturity.innerHTML = `maturity: ${grid[x][y][1].maturity}`

  //   //   }, 1200) // TODO - synchronize this with lifespeed somehow

  //     // element.addEventListener("mouseout", (event) => {
  //     //   popup.style.display = 'none';
  //     //   clearInterval(updatePopupContent);
  //     // }, {once: true})

  //   // })
  // }

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
    // Listen for mouse events
    box.addEventListener("mouseover", (event) => {
      if (!event.fromElement || !event.fromElement.dataset) return
      let el = event.fromElement
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
    const popupMaturity = document.getElementById('popup-maturity');
    
    if (this.selectedCell){
      if (this.selectedCell){
        const [x, y] = this.selectedCell
        if (grid[x][y] && grid[x][y][1]) {
          popup.style.display = "block"
          popupX.innerHTML = `x: ${x}`
          popupY.innerHTML = `y: ${y}`
          popupMaturity.innerHTML = `maturity: ${grid[x][y][1].maturity}`
          // console.log(grid[x][y][1].maturity)
        } else {
          popup.style.display = "none"
        }
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

  // getPlayerAtPosition(x, y) {
  //   for (let player of this.game.players) {
  //     if (player.position[0] === x && player.position[1] === y) {
  //       return player;
  //     }
  //   }
  //   return null;
  // }
}