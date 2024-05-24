const express = require('express')
const { createServer } = require('node:http')
const { join } = require('node:path');
const { Server } = require("socket.io");

const server = createServer();
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173/0"
  }
});

const app = express()

const { GameInstance } = require('./initialization.js');
const game = new GameInstance(100, 100)

app.get('/', (_req, res) => {
  res.sendFile(join(__dirname, 'index.html'));
});

io.on('connection', (socket) => {
  
  // const playState = game.initializePlayer()

  // socket.on('game state', (msg) => {
  //   io.emit('game state', msg);
  // });

});

server.listen(3000, () => {
  console.log("server running on http://localhost:3000")
})