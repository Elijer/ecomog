import { createServer } from 'http';
import { Server } from 'socket.io';
import GameInstance from './initialization.mjs';
import Moss from './entities/moss.mjs';

const dim = 50
const game = new GameInstance(dim, dim);
const lifeSpeed = 100

let reproductivePeriodCount = 0
let reproductivePeriod = true
let reproductivePeriodDuration = 80
let reproductiveLapseDuration = 40
setInterval(() => {
  console.log(reproductivePeriodCount)
  io.emit("life", game.portableState())
  reproductivePeriodCount++
  if (reproductivePeriod){
    game.life()
    if (reproductivePeriodCount > reproductivePeriodDuration){
      game.reproductivePeriod = false
      reproductivePeriodCount = 0
    }
  } else if (reproductivePeriodCount > reproductiveLapseDuration){
    reproductivePeriodCount++
    game.reproductivePeriod = true
    reproductivePeriodCount = 0
  }
}, lifeSpeed)

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