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
})

socket.on("disconnect", (reason, details) => {
  console.log("The server disconnect", reason, details)
});

document.addEventListener('keyup', (event) => {
  const keyName = event.key;

  console.log(`Key released: ${keyName}`);

  // You can add custom logic here
  if (keyName === 'w'){
    console.log("W")
    socket.emit("input event", {playerId, direction: "up"})
  }
  if (keyName === 'a') socket.emit("input event", {playerId, direction: "down"})
  if (keyName === 's') socket.emit("input event", {playerId, direction: "up"})
  if (keyName === 'd') socket.emit("input event", {playerId, direction: "right"})
  
});