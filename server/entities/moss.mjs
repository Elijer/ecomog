import Organism from './organism.mjs'
import rgbHex from 'rgb-hex';
import { clamp } from '#root/utilities.mjs'


export default class Moss extends Organism {
  constructor(
    rows,
    cols,
    grid,
    instances,
    position,
    generation = 1
    ){

      super(rows, cols, grid, instances, position, generation)
      this.rgb = [60, 180, 120]
      this.type = "moss"
    
    }

    reflect() {
      const computedMaturity = this.maturity / this.maxMaturity
      return '#' + rgbHex(this.rgb[0], this.rgb[1], this.rgb[2], clamp(computedMaturity, 0, 1))
    }

    portableState(){
      return {
        type: this.type,
        color: this.reflect(),
        maturity: this.maturity
      }
    }
}