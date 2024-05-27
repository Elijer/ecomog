# Socket.io
Socket.io comes with some nice built in features. The native websocket library it's built on is dead simple though, so it was tempting to use that as well. There is a branch in here that's the beginnings of it, just in case I want to try some things out with it.

# Socket.io on the Server
[Installation](https://socket.io/docs/v4/server-installation/)
[Initialization](https://socket.io/docs/v4/server-initialization/)
[Complete Server API](https://socket.io/docs/v4/server-api/#socket)

# Socket.io on the Client
[Socket instance](https://socket.io/docs/v4/client-socket-instance/)
[Complete Client API](https://socket.io/docs/v4/client-api/#socket) 

# To run locally
- Run `npm i` in the client and server folders
- `cd` into `server` and run `npm run serve`
- In another terminal, `cd` into `client` and run `npm run dev`
- Open your browser at (probably) `localhost:5173` but the command line in the terminal cd'd to client should tell you where vite is serving the clientside page
