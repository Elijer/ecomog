import { createServer } from 'http';
import { Server } from 'socket.io';
import GameInstance from './initialization.mjs';
import Moss from './entities/moss.mjs';

const game = new GameInstance(440, 200);

setInterval(() => {
  console.time("start")
  io.emit("life", game.portableState())
  game.life()
  console.timeEnd("start")  
}, 200)

// setInterval(() => {
//   console.time("start")
//   for (const [key, value] of Object.entries(game.mosses)){
//     const [x, y] = value.position
//     const aMoss = game.grid[x][y][1]
//     if (aMoss){
//       if (aMoss.maturity > .81 && aMoss.youth){
//         aMoss.reproductiveEra()
//       }

//       if (aMoss.maturity < aMoss.maturationInterval && aMoss.youth < 0){
//         aMoss.die()
//       }
      
//       if (aMoss.maturity > aMoss.maxMaturity){
//         aMoss.youth = -1
//       }
//     }
//   }
//   console.timeEnd("start")
// }, 1000)

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