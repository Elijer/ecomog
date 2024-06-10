import { v4 as uuidv4 } from 'uuid';
import { Item } from './tiles.mjs'
import RULES from '#root/saskanupe_constants.mjs'

export default class Organism extends Item {

  static emergence = .0005

  constructor(
    rows, cols, grid, instances, position, startingEnergy, generation = 1
  ){
    super(rows, cols, grid, 1)
    this.instances = instances
    this.grid = grid
    this.position = position && position.length ? position : this.findEmptyPoint()
    this.rgb = [60, 180, 120]
    this.generation = generation
    this.id = uuidv4()

    // Life Cycle
    this.maturity = 0
    this.maturationInterval = 1

    this.reproductionInterval = 17
    this.reproductiveWindow = [0, 1]
    this.maturityOutOfOne = 0

    this.photosynthete = false
    this.lifeSpan = startingEnergy
    this.storedEnergy = startingEnergy
    this.legacyEnergy = 0
    this.reproductionEnergyTransfer= 200

    this.land = grid[this.position[0]][this.position[1]][2]

  }

  photosynthesis(){
    if (this.land.cargogen >= 0){
      this.land.cargogen -= 1
      this.legacyEnergy += RULES.Cg_pA_rate
    }
  }

  live(){

    // Aging
    this.storedEnergy -= 1
    
    // Photosynthesis
    if (this.photosynthete) this.photosynthesis()
    
    if (this.storedEnergy <= 0) this.die()

    // Reproduction
    this.maturityOutOfOne = this.storedEnergy / (this.lifeSpan)
    if (this.storedEnergy % this.reproductionInterval === 0 && this.insideReproductiveWindow()){ 
        this.attemptReproduction()
    }

    // Death
    if (this.maturity < 0) this.die()
  }

  die(){
    const [x, y] = this.position
    this.grid[x][y][1] =  null

    // Redistribute the energy of the dead organism to the land
    this.land.cargogen += (this.lifeSpan + this.legacyEnergy ) / RULES.Cg_pA_rate
    delete this.instances[this.id]
  }

  insideReproductiveWindow(){
    return this.maturityOutOfOne > this.reproductiveWindow[0] && this.maturityOutOfOne < this.reproductiveWindow[1]
  }

  attemptReproduction(){
    const viableMove = this.viableMove()
    if (viableMove){

      // Check that the parent can afford to have a child
      // Subtract that cost from the parent's legacyEnergy
      if (this.legacyEnergy >= this.reproductionEnergyTransfer){
        // if reproductionEnergy transfer is 200 for example, remove that from the legacyEnergy and create a new moss with that amount of starting energy
        this.legacyEnergy -= this.reproductionEnergyTransfer
        const newMoss = new this.constructor(this.rows, this.cols, this.grid, this.instances, viableMove, this.reproductionEnergyTransfer, this.generation + 1)

        const [x, y] = newMoss.position
        this.instances[newMoss.id] = {
          position: [x, y]
        }
        this.grid[x][y][1] = newMoss
        
      }
    }
  }

  portableState(){
    return {
      ...super.portableState(),
      energy: this.storedEnergy,
      legacyEnergy: this.legacyEnergy
    }
  }

  probeSurroundings(){
    const viableMoves = [];
    const directions = [
        [-1,  0], // left
        [ 1,  0], // right
        [ 0, -1], // top
        [ 0,  1], // bottom
        [-1, -1], // top-left
        [ 1, -1], // top-right
        [-1,  1], // bottom-left
        [ 1,  1]  // bottom-right
    ];

    for (const [dx, dy] of directions) {
      const newX = this.position[0] + dx;
      const newY = this.position[1] + dy;
      if (this.tileExists(newX, newY)){
        let occupant = this.grid[newX][newY][1]
        if (!occupant )viableMoves.push([newX, newY, "empty"])
      }
    }
    return viableMoves
  }

  viableMove(){
    const viableMoves = this.probeSurroundings()
    
    if (viableMoves.length === 0) return

    const randomMove = viableMoves[Math.floor(Math.random() * viableMoves.length)]
    return randomMove
  }
}