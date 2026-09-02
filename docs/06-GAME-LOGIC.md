# 06 - Game Logic Specification

## 1. Authoritative Server Generation
When starting a match, the engine takes the host's `configuredChits` array and generates the physical pool:

```javascript
configuredChits.forEach(chitType => {
  for (let i = 1; i <= 4; i++) {
    pool.push({
      id: `${chitType.id}_${String(i).padStart(3, '0')}_${uuid()}`,
      typeId: chitType.id,
      name: chitType.name,
      emoji: chitType.emoji,
      color: chitType.color,
      isRevealed: false,
      isMatched: false
    });
  }
});
```

## 2. Server-Side Random Shuffling
The pool is randomized using Fisher-Yates shuffle algorithm on the Node.js runtime.

## 3. Match Evaluation & State Transition
- When 2 chits are picked:
  - Valid Match: `firstChit.typeId === secondChit.typeId`
  - Score added: `1 + (streak > 1 ? streakBonus : 0)`
  - Active player turn retained.
  - If all board chits are matched: advance round or trigger game over.
  - Mismatch: Both chits flipped back, turn rotated to next player in `playerOrder`.
