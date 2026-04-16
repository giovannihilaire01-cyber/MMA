// Daily Challenges System

export const DAILY_CHALLENGES = [
  {
    id: 'quick_win',
    name: 'Quick Win',
    description: 'Win 1 fight',
    reward: 5000,
    icon: '⚡',
    condition: (state, lastResults) => {
      if (!lastResults) return false
      const wins = lastResults.results.filter(r => r.winnerId).length
      return wins >= 1
    },
  },
  {
    id: 'full_card',
    name: 'Full Card',
    description: 'Organize a 5-fight event',
    reward: 10000,
    icon: '🎪',
    condition: (state, lastResults) => {
      if (!lastResults) return false
      return lastResults.results.length === 5
    },
  },
  {
    id: 'balanced_builder',
    name: 'Balanced Builder',
    description: 'Have 3 fighters at the same level',
    reward: 2500,
    icon: '⚖️',
    condition: (state) => {
      const levels = {}
      state.fighters.forEach(f => {
        const avg = (f.frappe + f.lutte + f.sol) / 3
        const level = Math.floor(avg / 10)
        levels[level] = (levels[level] || 0) + 1
      })
      return Object.values(levels).some(count => count >= 3)
    },
  },
  {
    id: 'streak_master',
    name: 'Streak Master',
    description: 'Get 3 consecutive wins',
    reward: 7500,
    icon: '🔥',
    condition: (state) => state.currentWinStreak >= 3,
  },
  {
    id: 'scout_master',
    name: 'Scout Master',
    description: 'Recruit a fighter',
    reward: 5000,
    icon: '🔎',
    condition: (state, _, recruitedToday) => recruitedToday >= 1,
  },
  {
    id: 'champion_maker_daily',
    name: 'Champion Maker',
    description: 'Have a fighter reach Level 3+',
    reward: 10000,
    icon: '⭐⭐⭐⭐',
    condition: (state) => state.fighters.some(f => {
      const avg = (f.frappe + f.lutte + f.sol) / 3
      return avg >= 55
    }),
  },
  {
    id: 'double_profit',
    name: 'Double Profit',
    description: 'End event with +$20k profit',
    reward: 15000,
    icon: '💰💰',
    condition: (state, lastResults, __, lastNet) => lastNet >= 20000,
  },
  {
    id: 'tournament_win',
    name: 'Tournament Victor',
    description: 'Win a tournament bracket',
    reward: 20000,
    icon: '🥇',
    condition: (state) => state.lastTournamentWon === true,
  },
  {
    id: 'perfect_week',
    name: 'Perfect Week',
    description: 'Complete 3 challenges (repeated weekly)',
    reward: 25000,
    icon: '✨',
    condition: (state) => state.dailyChallengesCompleted >= 3,
  },
]

// Get challenges for today
export function getDailyChallengesForToday() {
  const today = new Date().toDateString()
  const seed = today.split('').reduce((s, c) => s + c.charCodeAt(0), 0)

  // Use seed to deterministically select 3-5 challenges
  const indices = []
  for (let i = 0; i < DAILY_CHALLENGES.length; i++) {
    if (Math.abs(seed + i) % 10 < 5) {
      indices.push(i)
    }
  }

  // Ensure at least 3 and at most 5 challenges
  const selected = indices.slice(0, 5)
  if (selected.length < 3) {
    // Fallback: just pick first 3-4
    return DAILY_CHALLENGES.slice(0, 4)
  }

  return selected.map(i => DAILY_CHALLENGES[i])
}

// Check if challenge is completed
export function checkChallenge(challenge, state, lastResults, recruitedToday = 0, lastNet = 0) {
  return challenge.condition(state, lastResults, recruitedToday, lastNet)
}
