// Fighter Personalities System

export const PERSONALITIES = [
  {
    id: 'trash_talker',
    name: 'Trash Talker',
    icon: '🗣️',
    description: 'Loves to boast before fights',
    celebrationText: 'talked trash all the way!',
  },
  {
    id: 'humble_warrior',
    name: 'Humble Warrior',
    icon: '🙏',
    description: 'Quiet and focused',
    celebrationText: 'let his skills speak for him!',
  },
  {
    id: 'showman',
    name: 'Showman',
    icon: '🎭',
    description: 'Entertains the crowd',
    celebrationText: 'put on a show!',
  },
  {
    id: 'cold_killer',
    name: 'Cold Killer',
    icon: '🔪',
    description: 'Calculated and precise',
    celebrationText: 'executed his strategy perfectly!',
  },
  {
    id: 'underdog',
    name: 'Underdog',
    icon: '👊',
    description: 'Always fighting against the odds',
    celebrationText: 'proved everyone wrong!',
  },
]

// Assign random personality to a fighter
export function assignPersonality(fighter) {
  const personality = PERSONALITIES[Math.floor(Math.random() * PERSONALITIES.length)]
  return {
    ...fighter,
    personality: personality.id,
  }
}

// Get personality info
export function getPersonality(personalityId) {
  return PERSONALITIES.find(p => p.id === personalityId) || PERSONALITIES[0]
}
