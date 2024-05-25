const { createServer } = require('http');
const { Server } = require('socket.io');

const { GameInstance } = require('./initialization.js');
const game = new GameInstance(50, 50)
const lifeSpeed = 1000
setInterval(() => {
  game.life()
  io.emit("life", game)
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
    console.log(game.players)
    socket.emit("initial game state", game)

    socket.on("disconnecting", async(reason) => {
      game.removePlayer(playerId)
      console.log("Removed a player and now here is our game state")
      console.log(game.players)
    })
  })
});

httpServer.listen(3000);