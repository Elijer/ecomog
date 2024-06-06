import { createServer } from 'http';
import { Server } from 'socket.io';
import GameInstance from './game.mjs';

const lifeSpeed = 100

setInterval(() => {
  console.time("life")
  io.emit("life", game.portableState())
  game.life()

  let somePlayers = []
  for (let i = 0; i < game.rows; i++){
    for (let j = 0; j < game.cols; j++){
      if (game.grid[i][j][0]){
        somePlayers.push(game.grid[i][j][0].id)
      }
    }
  }
 console.timeEnd("life")
}, lifeSpeed)

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