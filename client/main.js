import './style.css'
import { setupCounter } from './counter.js'

const socket = new WebSocket('ws://localhost:8080')

socket.onmessage = ({data}) => {
  console.log("Message from server", data)
}

socket.onopen = () => {
  console.log("Connection established")
  socket.send("Hey")
}