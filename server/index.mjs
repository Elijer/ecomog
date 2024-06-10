import { createServer } from 'http';
import { Server } from 'socket.io';
import GameInstance from './game.mjs';
import { RULES, CHANNELS } from './saskanupe_constants.mjs';

let frame = 0

setInterval(() => {
  io.emit("life", game.portableState())
  game.life(frame)

  let somePlayers = []
  for (let i = 0; i < game.rows; i++){
    for (let j = 0; j < game.cols; j++){

      if (game.grid[i][j][CHANNELS.player]){
        somePlayers.push(game.grid[i][j][0].id)
      }
    }
  }
  frame++
}, RULES.world.lifeSpeed)

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

const game = new GameInstance(100, 100);

io.on("connection", (socket) => {

  console.log("Connected")


  socket.on("input event", (event) => {
    game.movePlayer(event.playerId, event.direction)
    io.emit("life", game.portableState())

  })


  socket.on("player joined", (playerId) => {
    game.initializePlayer(playerId)
    socket.emit("initial game state", game.portableState())

    socket.on("disconnecting", async(reason) => {
      console.log("Removed a player and now here is our game state")
    })
  })
});

httpServer.listen(3000);