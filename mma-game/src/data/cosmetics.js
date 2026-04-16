// Cosmetics System

export const COSMETICS = [
  {
    id: 'gold_ring',
    name: 'Gold Ring',
    category: 'ring',
    icon: '💛',
    unlockedAt: { type: 'budget', value: 100000 },
    description: 'Starter ring appearance',
  },
  {
    id: 'silver_ring',
    name: 'Silver Ring',
    category: 'ring',
    icon: '🩶',
    unlockedAt: { type: 'budget', value: 250000 },
    description: '$250k milestone ring',
  },
  {
    id: 'diamond_ring',
    name: 'Diamond Ring',
    category: 'ring',
    icon: '💎',
    unlockedAt: { type: 'budget', value: 1000000 },
    description: 'Legendary $1M ring',
  },
  {
    id: 'premium_music',
    name: 'Premium Music',
    category: 'entrance',
    icon: '🎵',
    unlockedAt: { type: 'events', value: 15 },
    description: 'Custom entrance music',
  },
  {
    id: 'championship_belt',
    name: 'Championship Belt',
    category: 'cosmetic',
    icon: '🏆',
    unlockedAt: { type: 'events', value: 30 },
    description: 'Prestige display item',
  },
  {
    id: 'legend_status',
    name: 'Legend Status',
    category: 'badge',
    icon: '👑',
    unlockedAt: { type: 'events', value: 50 },
    description: 'Hall of Fame legendary status',
  },
]

// Check if cosmetic is unlocked
export function isCosmeticUnlocked(cosmetic, state) {
  const { unlockedAt } = cosmetic

  if (unlockedAt.type === 'budget') {
    return state.promotion.budget >= unlockedAt.value
  } else if (unlockedAt.type === 'events') {
    return state.totalEvents >= unlockedAt.value
  } else if (unlockedAt.type === 'achievement') {
    return state.earnedAchievements?.includes(unlockedAt.value) || false
  }

  return false
}

// Get all unlocked cosmetics
export function getUnlockedCosmetics(state) {
  return COSMETICS.filter(c => isCosmeticUnlocked(c, state))
}
