const express = require('express')
const { createServer } = require('node:http')
const { join } = require('node:path');
const Websocket = require('ws')
const server = new Websocket.Server({ port: '8080' })

server.on('connection', socket => {

  socket.on('message', message => {
    console.log("MESSAGE RECIEVED")
    socket.send(`Roger that! ${message}`)
  })
})

const app = express()

const { GameInstance } = require('./initialization.js');
const game = new GameInstance(100, 100)

app.get('/', (_req, res) => {
  res.sendFile(join(__dirname, 'index.html'));
});

// io.on('connection', (socket) => {
  
  // const playState = game.initializePlayer()

  // socket.on('game state', (msg) => {
  //   io.emit('game state', msg);
  // });

// });

// server.listen(3000, () => {
//   console.log("server running on http://localhost:3000")
// })