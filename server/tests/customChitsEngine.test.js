const ChitGameEngine = require('../game/ChitGameEngine');
const assert = require('assert');

function runCustomChitTests() {
  console.log('🧪 Starting MatchMates Custom Chits Engine Tests...\n');

  // Test 1: Custom chits input & automatic x4 generation
  const customList = [
    { name: 'Apple', emoji: '🍎' },
    { name: 'Tiger', emoji: '🐯' },
    { name: 'Car', emoji: '🚗' },
    { name: 'Cricket', emoji: '🏏' }
  ];

  const engine = new ChitGameEngine({
    roomId: 'CUSTOM1',
    mode: 'chit_match',
    maxPlayers: 4,
    customChits: customList
  });

  assert.strictEqual(engine.configuredChits.length, 4, 'Should have 4 unique chit types');
  assert.strictEqual(engine.configuredChits.every(c => c.quantity === 4), true, 'Every type must have quantity = 4');
  console.log('✅ Test 1 Passed: Custom chits registered with automatic quantity = 4.');

  // Test 2: Duplicate name rejection (case-insensitive)
  const duplicateAttempt = engine.updateCustomChits([
    { name: 'Apple', emoji: '🍎' },
    { name: 'apple', emoji: '🍏' }, // duplicate in lowercase
    { name: 'Tiger', emoji: '🐯' },
    { name: 'Car', emoji: '🚗' }
  ], 'host_id');

  // If requester not in players map or duplicate, rejects
  engine.addPlayer({ id: 'host1', name: 'Host', isHost: true });
  const dupResult = engine.updateCustomChits([
    { name: 'Apple', emoji: '🍎' },
    { name: 'apple', emoji: '🍏' },
    { name: 'Tiger', emoji: '🐯' },
    { name: 'Car', emoji: '🚗' }
  ], 'host1');

  assert.strictEqual(dupResult.success, false, 'Duplicate names must be rejected');
  assert.ok(dupResult.error.includes('Duplicate chit name'), 'Error message specifies duplicate');
  console.log('✅ Test 2 Passed: Duplicate names rejected case-insensitively.');

  // Test 3: Minimum chit types validation (<4 rejected)
  const tooFewResult = engine.updateCustomChits([
    { name: 'Apple', emoji: '🍎' },
    { name: 'Tiger', emoji: '🐯' },
    { name: 'Car', emoji: '🚗' }
  ], 'host1');

  assert.strictEqual(tooFewResult.success, false, 'Less than 4 types rejected');
  console.log('✅ Test 3 Passed: Minimum 4 chit types enforced.');

  // Test 4: Host permissions (non-host rejected)
  engine.addPlayer({ id: 'guest1', name: 'Guest', isHost: false });
  const nonHostResult = engine.updateCustomChits([
    { name: 'Apple', emoji: '🍎' },
    { name: 'Tiger', emoji: '🐯' },
    { name: 'Car', emoji: '🚗' },
    { name: 'Cricket', emoji: '🏏' }
  ], 'guest1');

  assert.strictEqual(nonHostResult.success, false, 'Non-host cannot update chits');
  console.log('✅ Test 4 Passed: Non-host modification prohibited.');

  // Test 5: Game start & Physical pool generation with unique physical IDs
  engine.setPlayerReady('guest1', true);
  const startResult = engine.startGame();
  assert.strictEqual(startResult.success, true, 'Game starts successfully');

  // In matching mode with 4 types: 4 * 4 = 16 physical chits on board
  assert.strictEqual(engine.boardChits.length, 16, 'Should generate exactly 16 physical chits (4 types x 4 copies)');
  
  // Verify physical IDs are unique
  const idSet = new Set(engine.boardChits.map(c => c.id));
  assert.strictEqual(idSet.size, 16, 'All 16 physical chits must have unique internal IDs');
  console.log('✅ Test 5 Passed: 16 physical chits generated with unique IDs.');

  // Test 6: Matching evaluation with custom words
  const activePlayerId = engine.turnPlayerId;
  const firstCard = engine.boardChits[0];
  engine.handlePickChit(activePlayerId, firstCard.id);

  // Find another physical copy with the same custom name
  const twinCard = engine.boardChits.find(c => c.id !== firstCard.id && c.name === firstCard.name);
  const matchResult = engine.handlePickChit(activePlayerId, twinCard.id);

  assert.strictEqual(matchResult.success, true);
  assert.strictEqual(matchResult.matched, true);
  assert.strictEqual(matchResult.matchData.name, firstCard.name);
  console.log(`✅ Test 6 Passed: Valid match resolved for custom item "${firstCard.name}".`);

  // Test 7: Rematch with new custom chits
  const newSet = [
    { name: 'Superman', emoji: '🦸' },
    { name: 'Batman', emoji: '🦇' },
    { name: 'Flash', emoji: '⚡' },
    { name: 'Aquaman', emoji: '🔱' },
    { name: 'WonderWoman', emoji: '👸' }
  ];

  engine.restartGame(newSet);
  assert.strictEqual(engine.configuredChits.length, 5, 'New set applied with 5 types');
  assert.strictEqual(engine.configuredChits.length * 4, 20, 'Total chits is 20');
  console.log('✅ Test 7 Passed: Game reset with new custom chit set.');

  console.log('\n🎉 ALL 7 CUSTOM CHIT TESTS PASSED SUCCESSFULLY!\n');
}

runCustomChitTests();
