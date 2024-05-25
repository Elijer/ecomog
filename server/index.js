const { createServer } = require('http');
const { Server } = require('socket.io');

const { GameInstance } = require('./initialization.js');
const game = new GameInstance(100, 100)

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

    socket.on("disconnecting", async(reason) => {
      game.removePlayer(playerId)
      console.log("Removed a player and now here is our game state")
      console.log(game.players)
    })
  })
});



httpServer.listen(3000);

// io.on('connection', (socket) => {
  

  // socket.on('game state', (msg) => {
  //   io.emit('game state', msg);
  // });

// });