import './style.css'
import { io } from "socket.io-client";
import { v4 as uuidv4 } from 'uuid';

const playerId = () => localStorage.getItem('playerId') || localStorage.setItem('playerId', uuidv4())
const boxSize = 4;

const  socket = io("ws://localhost:3000")
socket.on("connect", () => {
  console.log(socket.emit("player joined", playerId()))
});

socket.on("initial game state", (game) => {
  for (let y = 0; y < game.rows; y++) {
    let row = document.createElement('div')
    row.classList.add('row')
    for (let x = 0; x < game.cols; x++) {
      let sq = document.createElement("div");
      sq.classList.add("sq");
      sq.style.cssText = `
        padding: ${boxSize}px;
        width: ${boxSize}px;
        height: ${boxSize}px;
        font-size: 10px;
        text-align: center;
      `;
      for (let player in game.players) {
        if (game.players[player].position[0] === x && game.players[player].position[1] === y) {
          sq.style.backgroundColor = game.players[player].color;
        }
      }
      //  console.log(y, x)
      row.appendChild(sq);
    }
    box.appendChild(row);
  }

  console.log(game)
})

socket.on("disconnect", (reason, details) => {
  console.log("The server disconnect", reason, details)
});