# 02 - Game Rules Specification

## 1. Setup & Chit Multiplying Rule
- Every unique chit type configured by the host creates **exactly 4 identical physical chits**.
- Total Chits = `Unique Types × 4`.
- Minimum unique types: 4 (16 chits). Maximum unique types: 20 (80 chits).

## 2. Grid Matching Mode Rules
1. **Turn Sequence**: Players take turns in randomized order.
2. **Action**: The active player flips two hidden cards on the board.
3. **Valid Match**: If both cards share the same chit type/name:
   - Player scores `+1 Point` (plus streak bonus if consecutive).
   - The two cards remain revealed and marked as matched.
   - The active player **retains their turn**!
4. **Mismatch**: If cards differ:
   - Cards flip back facedown after 1.2s.
   - Player's streak resets to 0.
   - Turn passes clockwise to the next player.
5. **Round End**: When all cards are matched, scores are tallied, and the next round begins.
6. **Victory**: The player with the highest cumulative score wins.

## 3. Social Chit Pass Mode Rules
1. **Distribution**: Each player is dealt 4 hidden chits.
2. **Passing**: Each turn, all players secretly select 1 chit to pass clockwise.
3. **MatchMates Claim**: The first player to hold **4 identical chits** claims victory for a `+5 Points` bonus.
