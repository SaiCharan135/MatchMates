# MatchMates API & Socket Events Reference

## REST API Endpoints

### 1. Health Check
- **`GET /api/health`**
- Returns server status (`game: "MatchMates"`), uptime, and timestamp.

### 2. Rooms
- **`POST /api/rooms`**
  - Body: `{ mode: "chit_match", maxPlayers: 8, totalRounds: 3, hostId: "usr_123" }`
  - Response: `{ success: true, roomCode: "A7K9P" }`
- **`GET /api/rooms/:roomCode`**
  - Response: Current room status, player count, and host ID.

### 3. Fruits Catalogue
- **`GET /api/fruits`**
  - Returns list of configurable fruit objects (id, name, emoji, color, points).

### 4. Leaderboard & Stats
- **`GET /api/leaderboard?limit=20`**
  - Returns top ranked players by wins, win-rate %, and total scores.
- **`GET /api/users/:playerId`**
  - Returns individual player career stats and recent match records.
- **`GET /api/history`**
  - Returns past game logs and winner summaries.

---

## Real-Time Socket.IO Events

| Event Name | Direction | Payload Description |
|---|---|---|
| `room:create` | Client -> Server | `{ mode, maxPlayers, totalRounds, player }` |
| `room:join` | Client -> Server | `{ roomCode, player }` |
| `player:join` | Server -> Room | Broadcasts new player info and updated room state |
| `player:ready` | Client <-> Server | Toggles player ready state |
| `game:start` | Client -> Server -> Room | Host starts game; broadcasts board setup |
| `turn:start` | Server -> Room | Announces active turn player |
| `player:move` | Client -> Server -> Room | Reveals chosen card on the board |
| `match:success` | Server -> Room | Valid match confirmed (+pts, retain turn) |
| `match:failed` | Server -> Room | Mismatch revealed, rotates turn |
| `score:update` | Server -> Room | Synchronizes real-time scoreboard |
| `round:end` | Server -> Room | Signals round transition |
| `game:end` | Server -> Room | Delivers final winner, rankings & stats |
| `game:restart` | Client <-> Server | Host restarts match or returns to lobby |
| `chat:send` / `chat:message` | Client <-> Room | Real-time chat messaging |
| `reaction:send` / `reaction:new` | Client <-> Room | Floating emoji reaction broadcast |
