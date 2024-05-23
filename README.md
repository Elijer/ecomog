# Networking
Going to start with [socket.io](https://socket.io/docs/v4/tutorial) and scale up from there as needed. Decided no, socket.io isn't ideal, but it should be fine to start with and relatively quick to get off the ground instead of building a UDP library (we talked about how TCP has some connectivity issues - it's too "under the hood")

Apparently socket.io can also recieve binary data.

# GDD

- define data structures

# MVC idea
- state store (model)
- browser view (view)
- generate refresh events (controller)


# Game Notes

Database
players: {
  [0, 0],
  [1, 1]
}


"Command Pattern"
- streams that produce events
  - Like from users
  - Or from the network
  - These are then translated into commands in your "world", or language

This decouples the language of your input streams from your serverside and clientside environments


Model -> command pattern -> view


Some ideas
- after fact conflict resolution
- by-force conflict resolution
- zone-based conflict resolution (multiple tiers?)