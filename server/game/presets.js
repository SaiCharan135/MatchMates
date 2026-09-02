/**
 * Built-in Preset Collections for MatchMates Custom Chits
 * Each preset item will automatically generate exactly 4 physical chits.
 */

const PRESET_COLLECTIONS = {
  fruits: {
    id: 'fruits',
    name: 'Juicy Fruits',
    emoji: '🍎',
    description: 'Classic crisp and sweet fruits',
    items: [
      { id: 'apple', name: 'Apple', emoji: '🍎', color: '#FF4D4D' },
      { id: 'banana', name: 'Banana', emoji: '🍌', color: '#FFD700' },
      { id: 'mango', name: 'Mango', emoji: '🥭', color: '#FF9800' },
      { id: 'grapes', name: 'Grapes', emoji: '🍇', color: '#9B51E0' },
      { id: 'watermelon', name: 'Watermelon', emoji: '🍉', color: '#27AE60' },
      { id: 'orange', name: 'Orange', emoji: '🍊', color: '#FFA500' },
      { id: 'pineapple', name: 'Pineapple', emoji: '🍍', color: '#F1C40F' },
      { id: 'strawberry', name: 'Strawberry', emoji: '🍓', color: '#E91E63' }
    ]
  },
  animals: {
    id: 'animals',
    name: 'Wild Animals',
    emoji: '🐯',
    description: 'Fierce and friendly creatures',
    items: [
      { id: 'tiger', name: 'Tiger', emoji: '🐯', color: '#FF7A00' },
      { id: 'lion', name: 'Lion', emoji: '🦁', color: '#F59E0B' },
      { id: 'elephant', name: 'Elephant', emoji: '🐘', color: '#64748B' },
      { id: 'panda', name: 'Panda', emoji: '🐼', color: '#475569' },
      { id: 'monkey', name: 'Monkey', emoji: '🐒', color: '#B45309' },
      { id: 'fox', name: 'Fox', emoji: '🦊', color: '#EA580C' },
      { id: 'zebra', name: 'Zebra', emoji: '🦓', color: '#334155' },
      { id: 'dolphin', name: 'Dolphin', emoji: '🐬', color: '#0284C7' }
    ]
  },
  sports: {
    id: 'sports',
    name: 'Sports & Games',
    emoji: '🏏',
    description: 'Action-packed sports and athletics',
    items: [
      { id: 'cricket', name: 'Cricket', emoji: '🏏', color: '#16A34A' },
      { id: 'football', name: 'Football', emoji: '⚽', color: '#0F172A' },
      { id: 'tennis', name: 'Tennis', emoji: '🎾', color: '#84CC16' },
      { id: 'basketball', name: 'Basketball', emoji: '🏀', color: '#EA580C' },
      { id: 'badminton', name: 'Badminton', emoji: '🏸', color: '#38BDF8' },
      { id: 'volleyball', name: 'Volleyball', emoji: '🏐', color: '#FACC15' },
      { id: 'hockey', name: 'Hockey', emoji: '🏑', color: '#DC2626' },
      { id: 'swimming', name: 'Swimming', emoji: '🏊', color: '#06B6D4' }
    ]
  },
  objects: {
    id: 'objects',
    name: 'Vehicles & Objects',
    emoji: '🚗',
    description: 'Everyday rides and gadgets',
    items: [
      { id: 'car', name: 'Car', emoji: '🚗', color: '#EF4444' },
      { id: 'bike', name: 'Bike', emoji: '🏍️', color: '#3B82F6' },
      { id: 'airplane', name: 'Airplane', emoji: '✈️', color: '#6366F1' },
      { id: 'rocket', name: 'Rocket', emoji: '🚀', color: '#F43F5E' },
      { id: 'train', name: 'Train', emoji: '🚆', color: '#10B981' },
      { id: 'ship', name: 'Ship', emoji: '🚢', color: '#0284C7' },
      { id: 'laptop', name: 'Laptop', emoji: '💻', color: '#64748B' },
      { id: 'camera', name: 'Camera', emoji: '📷', color: '#8B5CF6' }
    ]
  },
  movies: {
    id: 'movies',
    name: 'Cinema & Movies',
    emoji: '🎬',
    description: 'Iconic film genres and cinema items',
    items: [
      { id: 'action', name: 'Action', emoji: '💥', color: '#EF4444' },
      { id: 'comedy', name: 'Comedy', emoji: '😂', color: '#F59E0B' },
      { id: 'scifi', name: 'Sci-Fi', emoji: '🛸', color: '#8B5CF6' },
      { id: 'horror', name: 'Horror', emoji: '👻', color: '#64748B' },
      { id: 'romance', name: 'Romance', emoji: '💖', color: '#EC4899' },
      { id: 'superhero', name: 'Superhero', emoji: '🦸', color: '#3B82F6' },
      { id: 'mystery', name: 'Mystery', emoji: '🕵️', color: '#059669' },
      { id: 'animation', name: 'Animation', emoji: '🎨', color: '#10B981' }
    ]
  },
  friends: {
    id: 'friends',
    name: 'Friends Group',
    emoji: '⭐',
    description: 'Sample friendly names for group matches',
    items: [
      { id: 'sai', name: 'Sai', emoji: '👑', color: '#F59E0B' },
      { id: 'rahul', name: 'Rahul', emoji: '⚡', color: '#3B82F6' },
      { id: 'kiran', name: 'Kiran', emoji: '🔥', color: '#EF4444' },
      { id: 'arjun', name: 'Arjun', emoji: '🎯', color: '#10B981' },
      { id: 'ananya', name: 'Ananya', emoji: '🌸', color: '#EC4899' },
      { id: 'vikram', name: 'Vikram', emoji: '🦁', color: '#8B5CF6' }
    ]
  }
};

function getDefaultChits(presetId = 'fruits') {
  const preset = PRESET_COLLECTIONS[presetId] || PRESET_COLLECTIONS.fruits;
  return preset.items.map(item => ({
    id: item.id,
    name: item.name,
    emoji: item.emoji || '',
    color: item.color || '#FF7A00',
    quantity: 4
  }));
}

module.exports = {
  PRESET_COLLECTIONS,
  getDefaultChits
};
