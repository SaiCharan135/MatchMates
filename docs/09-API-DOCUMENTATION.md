# 09 - API Documentation

## 1. REST Endpoints

### `POST /api/games` or `POST /api/rooms`
Create a new multiplayer game room with custom chits.
- **Request Body**:
  ```json
  {
    "mode": "chit_match",
    "maxPlayers": 4,
    "totalRounds": 3,
    "hostId": "host_user_123",
    "customChits": [
      { "name": "Tiger", "emoji": "🐯" },
      { "name": "Apple", "emoji": "🍎" },
      { "name": "Car", "emoji": "🚗" },
      { "name": "Cricket", "emoji": "🏏" }
    ]
  }
  ```
- **Response `201`**:
  ```json
  {
    "success": true,
    "roomCode": "A7K9P",
    "configuredChits": [...],
    "totalChits": 16
  }
  ```

### `GET /api/games/:roomCode`
Fetch current public room state.

### `GET /api/games/:roomCode/chits`
Fetch room's configured chit types.

### `POST /api/games/:roomCode/chits`
Host updates room chits before game start.

### `GET /api/presets`
Retrieve built-in preset collections (Fruits, Animals, Sports, Vehicles, Movies, Friends).

### `GET /api/leaderboard`
Retrieve global leaderboard player rankings.
