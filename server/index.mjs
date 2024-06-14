import { networkInterfaces } from 'os';
import { createServer } from 'http';
import { Server } from 'socket.io';
import GameInstance from './game.mjs';
import { RULES, CHANNELS } from './saskanupe_constants.mjs';


/*
'use strict';

const { networkInterfaces } = require('os');

const nets = networkInterfaces();
const results = Object.create(null); // Or just '{}', an empty object

for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
        // Skip over non-IPv4 and internal (i.e. 127.0.0.1) addresses
        // 'IPv4' is in Node <= 17, from 18 it's a number 4 or 6
        const familyV4Value = typeof net.family === 'string' ? 'IPv4' : 4
        if (net.family === familyV4Value && !net.internal) {
            if (!results[name]) {
                results[name] = [];
            }
            results[name].push(net.address);
        }
    }
}
    */

// const getCurrentIp = () => {
//   const nets = networkInterfaces();
//   const results = Object.create(null); // Or just '{}', an empty object
  
//   for (const name of Object.keys(nets)) {
//       for (const net of nets[name]) {
//           // Skip over non-IPv4 and internal (i.e. 127.0.0.1) addresses
//           // 'IPv4' is in Node <= 17, from 18 it's a number 4 or 6
//           const familyV4Value = typeof net.family === 'string' ? 'IPv4' : 4
//           if (net.family === familyV4Value && !net.internal) {
//               if (!results[name]) {
//                   results[name] = [];
//               }
//               results[name].push(net.address);
//           }
//       }
//   }
//   console.log(results['en0'])
//   return results['en0']
// }

console.log(process.env.IP)

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
console.log()
const io = new Server(httpServer, {
  cors: {
    origin: process.env.NODE_ENV === "production" ? "https://thornberry-mog.herokuapp.com" : "http://localhost:8080",
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