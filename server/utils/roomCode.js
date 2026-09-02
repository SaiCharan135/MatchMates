/**
 * Room Code Generator for MatchMates
 * Generates unique 5-character readable codes like "A7K9P"
 */

const CHARSET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

function generateRoomCode(length = 5) {
  let code = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * CHARSET.length);
    code += CHARSET[randomIndex];
  }
  return code;
}

function sanitizeRoomCode(code) {
  if (!code || typeof code !== 'string') return '';
  return code.trim().toUpperCase().replace(/[^A-Z0-9]/g, '');
}

module.exports = {
  generateRoomCode,
  sanitizeRoomCode
};
