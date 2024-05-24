const { createServer } = require('http');
const { Server } = require('socket.io');

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
    console.log(playerId)
  })
});

httpServer.listen(3000);

// const { GameInstance } = require('./initialization.js');
// const game = new GameInstance(100, 100)

// io.on('connection', (socket) => {
  
  // const playState = game.initializePlayer()

  // socket.on('game state', (msg) => {
  //   io.emit('game state', msg);
  // });

// });