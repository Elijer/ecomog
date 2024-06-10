const RULES = {
  Cg_pA_rate: 20, // how much e can be generated per Cg per sq per moment
  noiseCargogenRatio: 200, // how much Cg is seeded per max noise value
  world: {
    lifeSpeed: 100
  }
}

const CHANNELS = {
  player: 0,
  moss: 1,
  terrain: 2,
  nwa: 3
}

export { RULES, CHANNELS }