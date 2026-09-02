# 08 - Database Design

## 1. Schemas & Models

### Game Schema
```javascript
{
  roomCode: String,      // Indexed unique 5-char code
  hostId: String,
  mode: String,          // 'chit_match' | 'chit_pass'
  maxPlayers: Number,
  status: String,        // 'waiting' | 'in_progress' | 'completed'
  chitSet: {
    name: String,
    items: [
      {
        id: String,
        name: String,
        emoji: String,
        color: String,
        quantity: { type: Number, default: 4 }
      }
    ]
  },
  createdAt: Date
}
```

### GameHistory Schema
```javascript
{
  roomCode: String,
  mode: String,
  totalRounds: Number,
  chitSet: { name: String, items: Array },
  winner: { id: String, name: String, avatar: String, score: Number },
  players: [
    { id: String, name: String, avatar: String, score: Number, matchesCount: Number }
  ],
  playedAt: Date
}
```

## 2. In-Memory Fallback
If MongoDB connection is unavailable, `dbService.js` uses an in-memory repository with pre-seeded demo records to guarantee uninterrupted local gameplay.
