# MatchMates Game Rules

## 1. Overview
**MatchMates** is a fast, social casual matching game for 2 to 8 players set in a vibrant fruit theme.

## 2. Core Game Modes

### Mode A: Classic Fruit Matching (Default)
1. **Dealing**: The server generates a hidden grid of fruit cards containing matching pairs (Apple, Banana, Orange, Grapes, Watermelon, Mango, Pineapple, Strawberry, etc.).
2. **Turn Rotation**: On a player's turn, they pick **2 hidden cards** from the board.
3. **Matching Evaluation**:
   - If both cards match (e.g. `🍎 Apple + 🍎 Apple`):
     - The player scores **+1 point**.
     - The cards remain face up and marked as matched.
     - The player keeps their turn and can match again!
     - Combo matches build a **Streak Multiplier (🔥 2x, 3x)**.
   - If the cards do not match (e.g. `🍎 Apple + 🍌 Banana`):
     - The cards are briefly revealed to all players for 1.2 seconds so others can memorize positions.
     - The cards flip back down.
     - The turn passes clockwise to the next player.
4. **Round End**: The round concludes when all pairs are matched. The game progresses through the configured number of rounds (1, 3, or 5 rounds).
5. **Winner**: The player with the highest accumulated score across all rounds is crowned the MatchMates Champion!

---

### Mode B: Social Pass
1. **Dealing**: Every player receives 4 hidden fruit cards.
2. **Passing**: In each turn, all players choose one unwanted card to pass clockwise to the next player.
3. **Claiming**: The first player to collect 4 identical fruits (e.g., 4x `🥭 Mango`) clicks **CLAIM MATCHMATES** to score **+5 points** and win the round.
