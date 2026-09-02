const ChitGameEngine = require('../game/ChitGameEngine');
const assert = require('assert');

function runTests() {
  console.log('🧪 Starting MatchMates Game Engine Tests...\n');

  // Test 1: Room creation & Player adding
  const engine = new ChitGameEngine({
    roomId: 'TEST1',
    mode: 'chit_match',
    maxPlayers: 4,
    minPlayers: 2,
    totalRounds: 2
  });

  const p1 = engine.addPlayer({ id: 'p1', name: 'Sai', avatar: '🥭', isHost: true });
  const p2 = engine.addPlayer({ id: 'p2', name: 'Rahul', avatar: '🍎', isHost: false });

  assert.strictEqual(p1.success, true, 'Player 1 should join successfully');
  assert.strictEqual(p2.success, true, 'Player 2 should join successfully');
  assert.strictEqual(engine.players.size, 2, 'Should have 2 players');
  console.log('✅ Test 1 Passed: Players added successfully.');

  // Test 2: Starting without ready players fails
  const canStartBeforeReady = engine.canStartGame('p1');
  assert.strictEqual(canStartBeforeReady.canStart, false, 'Should not start if players are not ready');
  console.log('✅ Test 2 Passed: Ready check prevents early start.');

  // Test 3: Set ready and start
  engine.setPlayerReady('p2', true);
  const canStartAfterReady = engine.canStartGame('p1');
  assert.strictEqual(canStartAfterReady.canStart, true, 'Should start when all ready');

  const startRes = engine.startGame();
  assert.strictEqual(startRes.success, true, 'Game should start');
  assert.strictEqual(engine.status, 'in_progress', 'Status should be in_progress');
  assert.ok(engine.boardChits.length > 0, 'Board chits should be populated');
  console.log('✅ Test 3 Passed: Game started with board chits populated.');

  // Test 4: Turn enforcement
  const activePlayerId = engine.turnPlayerId;
  const nonActivePlayerId = activePlayerId === 'p1' ? 'p2' : 'p1';

  const invalidTurnMove = engine.handlePickChit(nonActivePlayerId, engine.boardChits[0].id);
  assert.strictEqual(invalidTurnMove.success, false, 'Non-active player cannot make move');
  assert.strictEqual(invalidTurnMove.error, 'Not your turn!');
  console.log('✅ Test 4 Passed: Server enforces turn authority strictly.');

  // Test 5: Pick two matching or non-matching chits
  const chit1 = engine.boardChits[0];
  const pick1 = engine.handlePickChit(activePlayerId, chit1.id);
  assert.strictEqual(pick1.success, true, 'First pick succeeds');
  assert.strictEqual(pick1.action, 'first_pick');

  // Find second chit with same or different type
  const matchingChit = engine.boardChits.find(c => c.id !== chit1.id && c.typeId === chit1.typeId);
  const pick2 = engine.handlePickChit(activePlayerId, matchingChit.id);
  assert.strictEqual(pick2.success, true, 'Second pick succeeds');
  assert.strictEqual(pick2.action, 'match_success');
  assert.strictEqual(pick2.matched, true);

  const activePlayer = engine.players.get(activePlayerId);
  assert.ok(activePlayer.score >= 1, 'Player score should increase on match');
  console.log('✅ Test 5 Passed: Match detection, scoring, and state update verified.');

  // Test 6: Anti-cheat public state sanitization
  const publicState = engine.getPublicGameState();
  const unrevealedChit = publicState.boardChits.find(c => !c.isMatched && !c.isRevealed);
  if (unrevealedChit) {
    assert.strictEqual(unrevealedChit.name, undefined, 'Public state must not leak hidden chit names');
    assert.strictEqual(unrevealedChit.emoji, undefined, 'Public state must not leak hidden emojis');
  }
  console.log('✅ Test 6 Passed: Anti-cheat sanitization verified.');

  console.log('\n🎉 ALL 6 TESTS PASSED SUCCESSFULLY!\n');
}

runTests();
