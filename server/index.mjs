import { createServer } from 'http';
import { Server } from 'socket.io';
import GameInstance from './game.mjs';
import Moss from './entities/moss.mjs';

setInterval(() => {
  io.emit("life", game.portableState())
  game.life()

  let somePlayers = []
  for (let i = 0; i < game.rows; i++){
    for (let j = 0; j < game.cols; j++){
      if (game.grid[i][j][0]){
        somePlayers.push(game.grid[i][j][0].id)
        // console.log(game.grid[i][j][0].id)
      }
    }
  }
 
}, 200)

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

    // Manual Debugging tile by tile
    // game.grid[0][0][1] = new Moss(dim, dim, game.grid, game.mosses, [0, 0], 1)
    // game.grid[0][0][1].attemptReproduction()
    // socket.emit("life", game.portableState())

    socket.on("disconnecting", async(reason) => {
      console.log("Removed a player and now here is our game state")
    })
  })
});

httpServer.listen(3000);