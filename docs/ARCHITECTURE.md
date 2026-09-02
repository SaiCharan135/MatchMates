# MatchMates Architecture Specification

## Overview

**MatchMates** is a real-time multiplayer casual matching web game built using an authoritative server architecture with Node.js, Express, Socket.IO, and React.

---

## High-Level Architecture Diagram

```
+---------------------------------------------------------+
|                 MatchMates React Client                 |
|  - React 18 + Vite SPA                                  |
|  - Web Audio API Sound Synthesizer                      |
|  - 3D CSS Flip Fruit Cards & Canvas Confetti            |
|  - GameContext / Socket Service                         |
+---------------------------------------------------------+
                          |
             WebSocket / HTTP REST
                          |
+---------------------------------------------------------+
|                   Node / Express Server                 |
|  - Port 4000                                            |
|  - Helmet & Rate-Limiting Security Middleware           |
|  - REST API Routes (/api/rooms, /api/leaderboard, etc.) |
+---------------------------------------------------------+
                          |
+---------------------------------------------------------+
|                     Socket.IO Layer                     |
|  - Room Management & 5-character Code Generator (A7K9P) |
|  - Player Ready / Connection State Tracking             |
|  - Real-Time Turn Clock & Live Emojis / Chat            |
+---------------------------------------------------------+
                          |
+---------------------------------------------------------+
|             Game Engine (Source of Truth)               |
|  - Hidden Card Board Deck Shuffling                     |
|  - Anti-Cheat State Sanitization                        |
|  - Strict Turn Enforcement                              |
|  - Pair & Quad Matching Validation                      |
|  - Scoring & Streak Multipliers                         |
+---------------------------------------------------------+
                          |
+---------------------------------------------------------+
|            Database Layer (MongoDB + Fallback)          |
|  - Mongoose Schemas (User, Game, GameHistory)           |
|  - Resilient In-Memory Fallback Store                   |
+---------------------------------------------------------+
```

---

## Anti-Cheat Security

1. **Hidden Card Sanitization**: The server never sends the fruit type (`fruitName`, `emoji`, `points`) of unrevealed cards in the public state broadcast.
2. **Authoritative Turns**: Card flips and matches are evaluated exclusively on the server. If a client attempts to flip out-of-turn or forge matches, the server rejects the request.
3. **Server Calculated Scores**: All point increments and win states are computed server-side.
