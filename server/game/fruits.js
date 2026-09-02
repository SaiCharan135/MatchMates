/**
 * Configurable Fruit Definitions for MatchMates
 */

const DEFAULT_FRUITS = [
  { id: 'apple', name: 'Apple', emoji: '🍎', color: '#FF4D4D', bgGradient: 'linear-gradient(135deg, #FF4D4D, #C60000)', points: 1 },
  { id: 'banana', name: 'Banana', emoji: '🍌', color: '#FFD700', bgGradient: 'linear-gradient(135deg, #FFE066, #E5B800)', points: 1 },
  { id: 'orange', name: 'Orange', emoji: '🍊', color: '#FFA500', bgGradient: 'linear-gradient(135deg, #FFA940, #D96800)', points: 1 },
  { id: 'grapes', name: 'Grapes', emoji: '🍇', color: '#9B51E0', bgGradient: 'linear-gradient(135deg, #B37FEB, #722ED1)', points: 1 },
  { id: 'watermelon', name: 'Watermelon', emoji: '🍉', color: '#27AE60', bgGradient: 'linear-gradient(135deg, #52C41A, #135200)', points: 1 },
  { id: 'mango', name: 'Mango', emoji: '🥭', color: '#FF9800', bgGradient: 'linear-gradient(135deg, #FFC069, #FA8C16)', points: 1 },
  { id: 'pineapple', name: 'Pineapple', emoji: '🍍', color: '#F1C40F', bgGradient: 'linear-gradient(135deg, #FFEC3D, #D4B106)', points: 1 },
  { id: 'strawberry', name: 'Strawberry', emoji: '🍓', color: '#E91E63', bgGradient: 'linear-gradient(135deg, #FF85C0, #EB2F96)', points: 1 },
  { id: 'kiwi', name: 'Kiwi', emoji: '🥝', color: '#8BC34A', bgGradient: 'linear-gradient(135deg, #95DE64, #389E0D)', points: 1 },
  { id: 'dragonfruit', name: 'Dragonfruit', emoji: '🐉', color: '#EC407A', bgGradient: 'linear-gradient(135deg, #F759AB, #9E1068)', points: 2 },
  { id: 'cherry', name: 'Cherry', emoji: '🍒', color: '#D32F2F', bgGradient: 'linear-gradient(135deg, #FF4D4F, #A8071A)', points: 1 },
  { id: 'coconut', name: 'Coconut', emoji: '🥥', color: '#795548', bgGradient: 'linear-gradient(135deg, #D4B106, #614700)', points: 1 }
];

function getFruitList(mode = 'standard', customFruits = null) {
  if (Array.isArray(customFruits) && customFruits.length >= 4) {
    return customFruits;
  }
  
  if (mode === 'classic8') {
    return DEFAULT_FRUITS.slice(0, 8);
  }
  
  if (mode === 'quick4') {
    return DEFAULT_FRUITS.slice(0, 4);
  }

  // standard default is 8 core fruits (Apple, Banana, Orange, Grapes, Watermelon, Mango, Pineapple, Strawberry)
  return DEFAULT_FRUITS.slice(0, 8);
}

module.exports = {
  DEFAULT_FRUITS,
  getFruitList
};
