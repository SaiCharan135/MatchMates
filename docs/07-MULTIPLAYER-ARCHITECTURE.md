# 07 - Multiplayer Architecture

## 1. System Overview
- **Protocol**: WebSocket via Socket.IO v4.8.
- **Topology**: Client-Server Authoritative architecture.
- **Rooms**: Isolated Socket.IO rooms keyed by 5-character room code (`A7K9P`).

```
[Host Client] ──(room:create)──► [Node.js + Socket.IO Server] ◄──(room:join)── [Player Clients]
                                           │
                                  [ChitGameEngine]
                           (Generates 4x Physical Pool,
                           Sanitizes Secret Card State,
                           Validates Turns & Matches)
```

## 2. Event Lifecycle
1. `room:create` / `room:join` → Socket joins room channel.
2. `chits:update` → Host modifies custom chit types, broadcasts `chits:updated` to all players.
3. `player:ready` → Toggles player ready state.
4. `game:start` → Validates requirements, shuffles cards, emits `turn:start`.
5. `player:move` → Client sends card index pick; server evaluates and emits `match:success` or `match:failed`.
6. `game:end` → Broadcasts winner and final rankings.
7. `game:restart` → Resets board with same chits or new chits.
