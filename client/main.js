import './style.css'
import { io } from "socket.io-client";
import { v4 as uuidv4 } from 'uuid';

const playerId = localStorage.getItem('playerId') || localStorage.setItem('playerId', uuidv4())
console.log(playerId)

const  socket = io("ws://localhost:3000")
socket.on("connect", () => {
  console.log("Connected")
  console.log(socket.emit("player joined", playerId))
});