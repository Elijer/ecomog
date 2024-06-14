import Organism from './organism.mjs'
import rgbHex from 'rgb-hex';
import { CHANNELS } from '#root/saskanupe_constants.mjs';


export default class Moss extends Organism {

  // static emergence = .1

  constructor(
    rows,
    cols,
    grid,
    instances,
    position,
    startingEnergy,
    generation = 1,
    ){

      super(rows, cols, grid, instances, position, CHANNELS.moss, startingEnergy, generation)
      this.rgb = [60, 180, 120]
      this.type = "moss"
      this.photosynthete = true
      this.lifeCadence = 10
    
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