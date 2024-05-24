import './style.css'
import { io } from "socket.io-client";

const URL = "http://localhost:3000"
// import { setupCounter } from './counter.js'

const socket = io(URL);

socket.on('connect', () => {
  console.log('connected');
  
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});
    
      // form.addEventListener('submit', (e) => {
      //   e.preventDefault();
      //   if (input.value) {
      //     socket.emit('chat message', input.value);
      //     input.value = '';
      //   }
      // });

      // socket.on('chat message', (msg) => {
      //   socket.emit("chat message", "tets")
      //   const item = document.createElement('li');
      //   item.textContent = msg;
      //   messages.appendChild(item);
      //   window.scrollTo(0, document.body.scrollHeight);
      // });

setupCounter(document.querySelector('#counter'))
