import rgbHex from 'rgb-hex';
import { roundTo } from '#root/utilities.mjs';
import RULES from '#root/saskanupe_constants.mjs'

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

  tileExists(x, y){
    return x >= 0 && x < this.cols -1 && y >= 0 && y < this.rows -1
  }
}

export class TerrainTile extends Tile {
  constructor(noise){
    super()
    this.rgb = [14, 5, 18]
    this.noise = noise
    this.cargogen = noise * RULES.noiseCargogenRatio // 1 * RULES.noiseCargogenRatio being the max amount of Cg that could seed
    this.type = "terrain"
    this.color = this.parseMinerals()
    // this.color = 
  }

  parseMinerals(cargogen){
    return '#' + rgbHex(this.rgb[0], this.rgb[1], this.rgb[2], this.noise)
  }
  
  // TODO: If I want mineral deposits, it would be more interesting to distribute them less randomly
  // More like a vein or a deposit
  getRandomTerrainColor(){
    const terrainColors = ["#010101", "#010101", "#020202", "#030303", "#040404", "#050505", "#060606", "#070707", "#080808", "#090909"];
    return terrainColors[Math.floor(Math.random() * terrainColors.length)]
  }

  portableState(){
    return {
      ...super.portableState(),
      cargogen: roundTo(this.cargogen, 0)
    }
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