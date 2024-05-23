const { v4: uuidv4 } = require('uuid');
const express = require('express')
const { createServer } = require('node:http')
const { join } = require('node:path');
const { Server } = require("socket.io");

const app = express()
const server = createServer(app)
const io = new Server(server)

app.get('/', (req, res) => {
  res.sendFile(join(__dirname, 'index.html'));
});

io.on('connection', (socket) => {
  console.log('a user connected');
});

server.listen(3000, () => {
  console.log("server running on 3000")
})


const createEmptyGrid = (sizeX, sizeY) => {
  const grid = new Array(sizeY)
  for (let i = 0; i < grid.length; i++) {
    grid[i] = new Array(sizeX).fill("e");
  }
  return grid
}

const ROWS = 100
const COLS = 100
const grid = createEmptyGrid(ROWS, COLS)

const players = []

const generateRandomPoint = (ROWS, COLS) => {
  return [Math.floor(Math.random() * ROWS), Math.floor(Math.random() * COLS)]
}

const assignRandomPoint = (players) => {
  let randomPoint = generateRandomPoint(ROWS, COLS)
  
  for (const player in players){
    if (player.position === randomPoint) {
      return assignRandomPoint(players)
    }
  }

  return randomPoint

}


const initializePlayer = () => {
  players.push(
    {
    name: uuidv4(),
    position: assignRandomPoint(players)
    }
  )

  return players
}

initializePlayer()

const placeNewPlayer = (player) => {
  grid[player.position[0]][player.position[1]] = "p"
}



// console.log(initializePlayer())

// const player = {}

// let gameState = {
//   players: [],
//   gridPresence: []
// }


// Share components
// Initial connection logic
// Assess any existing players location
// randomly generate a location for the player and send it back
// and save it
// send this info too: where all the players are
// Info about the world: 8x8 grid for example

//what does the connection sequence look like?
// Start with websockets