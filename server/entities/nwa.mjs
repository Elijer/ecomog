import Organism from './organism.mjs'
import rgbHex from 'rgb-hex';
import { CHANNELS } from '#root/saskanupe_constants.mjs';


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

      super(rows, cols, grid, instances, position, CHANNELS.nwa, startingEnergy, generation)
      this.rgb = [60, 180, 120]
      this.type = "nwa"
      this.photosynthete = false
      this.color = "brown"
    }
}