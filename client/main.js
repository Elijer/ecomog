import './style.css'
import { io } from "socket.io-client";
import { v4 as uuidv4 } from 'uuid';
import God from './god.js'

let god;
const playerId = () => localStorage.getItem('playerId') || localStorage.setItem('playerId', uuidv4())
const mapConfig = {
  sqSize: 2
}

const  socket = io("ws://localhost:3000")
socket.on("connect", () => {
  console.log("Connected")
  socket.emit("player joined", playerId())
});

socket.on("initial game state", (game) => {
  god = new God(game, mapConfig)
  god.createWorld()
})

socket.on("life", (game) => {
  god.letTimeFlow(game)
  god.printCellData(game.grid)
  god.printOrganismData(game.grid)
})

socket.on("disconnect", (reason, details) => {
  console.log("The server disconnect", reason, details)
});

document.addEventListener('keydown', (event) => {
  if (socket.connected === false) return
  const keyName = event.key;


  // You can add custom logic here
  const directions = {
    w: "up",
    a: "left",
    s: "down",
    d: "right"
  };

  if (directions.hasOwnProperty(keyName)) {
    socket.emit("input event", { playerId: playerId(), direction: directions[keyName] });
  }
  
});