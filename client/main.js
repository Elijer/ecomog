import './style.css'
import { io } from "socket.io-client";
import { v4 as uuidv4 } from 'uuid';
import God from './god.js'

let god;
const playerId = () => localStorage.getItem('playerId') || localStorage.setItem('playerId', uuidv4())
const mapConfig = {
  sqSize: 4
}

const  socket = io("ws://localhost:3000")
socket.on("connect", () => {
  console.log(socket.emit("player joined", playerId()))
});

socket.on("initial game state", (game) => {
  god = new God(game, mapConfig)
  god.createWorld()
})

socket.on("life", (game) => {
  console.log(game)
  god.letTimeFlow(game)
})

socket.on("disconnect", (reason, details) => {
  console.log("The server disconnect", reason, details)
});