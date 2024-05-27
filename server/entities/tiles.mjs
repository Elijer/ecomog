export class Tile {
  constructor(){
    this.type = "tile"
    this.color = "#000000"
  }

  portableState(){
    return {
      color: this.color,
      type: this.type
    }
  }
}

export class TerrainTile extends Tile {
  constructor(){
    super()
    this.type = "terrain"
    this.color = this.getRandomTerrainColor()
  }
  
  // TODO: If I want mineral deposits, it would be more interesting to distribute them less randomly
  // More like a vein or a deposit
  getRandomTerrainColor(){
    const terrainColors = ["#00000", "#010101", "#020202", "#030303", "#040404", "#050505", "#060606", "#070707", "#080808"];
    return terrainColors[Math.floor(Math.random() * terrainColors.length)]
  }
}

export class Item extends Tile {
  constructor(rows, cols, grid, channel = 2){
    super()
    this.type = "item"
    this.rows = rows
    this.cols = cols
    this.grid = grid
    this.position = []
    this.channel = channel
  }

  findEmptyPoint(){
    // TODO: Set some sort of limit to how many times this is called recursively
    const [x, y] = this.generateRandomPoint()
    if (this.grid[x][y][this.channel] === null){
      return [x, y]
    }

    return this.findEmptyPoint()
  }

  generateRandomPoint = () => {
    return [Math.floor(Math.random() * this.rows), Math.floor(Math.random() * this.cols)]
  }
}