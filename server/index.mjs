import { createServer } from 'http';
import { Server } from 'socket.io';
import GameInstance from './initialization.mjs';

const game = new GameInstance(50, 50);
const lifeSpeed = 100
setInterval(() => {
  game.life()
  io.emit("life", game.portableState())
  // console.log(game.moss[24].maturity)
  // console.log(game.moss[24].dead)
  // console.log(game.moss[24].young)
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
    socket.emit("initial game state", game.portableState())

    socket.on("disconnecting", async(reason) => {
      game.removePlayer(playerId)
      console.log("Removed a player and now here is our game state")
      // console.log(game.players)
    })
  })
});

httpServer.listen(3000);