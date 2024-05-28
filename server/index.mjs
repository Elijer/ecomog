import { createServer } from 'http';
import { Server } from 'socket.io';
import GameInstance from './initialization.mjs';
import Moss from './entities/moss.mjs';

const dim = 60
const game = new GameInstance(dim, dim);
const lifeSpeed = 100

setInterval(() => {
  io.emit("life", game.portableState())
  game.life()
}, lifeSpeed)

setInterval(() => {
  for (const [key, value] of Object.entries(game.mosses)){
    const [x, y] = value.position
    const aMoss = game.grid[x][y][1]
    if (aMoss){
      if (aMoss.maturity > .5 && aMoss.maturity < .8 && aMoss.youth){
          const tempInterval = setInterval(() => {
            aMoss.attemptReproduction()
          }, 100)
          setTimeout(() => {
          clearInterval(tempInterval)
          }, 1200)
      }
      
      if (aMoss.maturity > aMoss.maxMaturity){
        aMoss.die()
        // aMoss.youth = -.2
      }
    }
  }
}, 3000)

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});


io.on("connection", (socket) => {
  console.log("Connected")
  socket.on("player joined", (playerId) => {
    game.initializePlayer(playerId)
    // console.log(game.players)
    // game.portableState()
    socket.emit("initial game state", game.portableState())

    // Manual Debugging tile by tile
    // game.grid[0][0][1] = new Moss(dim, dim, game.grid, game.mosses, [0, 0], 1)
    // game.grid[0][0][1].attemptReproduction()
    // socket.emit("life", game.portableState())

    socket.on("disconnecting", async(reason) => {
      // game.removePlayer(playerId)
      console.log("Removed a player and now here is our game state")
      // console.log(game.players)
    })
  })
});

httpServer.listen(3000);