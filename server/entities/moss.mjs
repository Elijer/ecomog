import Organism from './organism.mjs'
import rgbHex from 'rgb-hex';


export default class Moss extends Organism {
  constructor(
    rows,
    cols,
    grid,
    instances,
    position,
    startingEnergy,
    generation = 1,
    ){

      super(rows, cols, grid, instances, position, startingEnergy, generation)
      this.rgb = [60, 180, 120]
      this.type = "moss"
      this.photosynthete = true
    
    }

    getPyramidMaturity = () => {
      return 2 * (.5 - Math.abs(this.maturityOutOfOne - .5))
    }

    reflect() {
      return '#' + rgbHex(this.rgb[0], this.rgb[1], this.rgb[2], this.getPyramidMaturity() )
    }

    portableState(){
      return {
        ...super.portableState(),
        color: this.reflect(),
      }
    }
}