# GDD

- define data structures

# MVC idea
- state store (model)
- browser view (view)
- generate refresh events (controller)






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