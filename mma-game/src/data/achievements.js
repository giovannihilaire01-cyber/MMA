// 50+ Achievements for MMA Promotion Manager

export const ACHIEVEMENTS = [
  // TIER 1: Startup (0-15)
  {
    id: 'first_event',
    name: 'First Event',
    description: 'Organize your first event',
    icon: '🎪',
    category: 'startup',
    condition: (state) => state.totalEvents >= 1,
  },
  {
    id: 'profitable',
    name: 'Profitable',
    description: 'End an event with +$5k profit',
    icon: '💰',
    category: 'startup',
    condition: (state, lastNet) => lastNet >= 5000,
  },
  {
    id: 'recruiter',
    name: 'Recruiter',
    description: 'Recruit your first fighter',
    icon: '👥',
    category: 'startup',
    condition: (state) => state.fighters.length >= 17, // 16 initial + 1
  },
  {
    id: 'champion_maker',
    name: 'Champion Maker',
    description: 'Have a fighter reach Level 3+',
    icon: '⭐⭐⭐⭐',
    category: 'startup',
    condition: (state) => state.fighters.some(f => {
      const avg = (f.frappe + f.lutte + f.sol) / 3
      return avg >= 55
    }),
  },
  {
    id: 'undefeated',
    name: 'Undefeated',
    description: 'Have a fighter go 5-0',
    icon: '🏆',
    category: 'startup',
    condition: (state) => state.fighters.some(f => f.bilan.v >= 5 && f.bilan.d === 0),
  },
  {
    id: 'double_digit',
    name: 'Double Digit',
    description: 'Organize 10 total fights',
    icon: '🔟',
    category: 'startup',
    condition: (state) => state.totalFights >= 10,
  },
  {
    id: 'scout_master',
    name: 'Scout Master',
    description: 'Recruit 5 fighters',
    icon: '🔎',
    category: 'startup',
    condition: (state) => state.fighters.length >= 21,
  },
  {
    id: 'dynasty_starter',
    name: 'Dynasty',
    description: 'Have 3 fighters at Level 2+',
    icon: '👑',
    category: 'startup',
    condition: (state) => {
      const count = state.fighters.filter(f => {
        const avg = (f.frappe + f.lutte + f.sol) / 3
        return avg >= 40
      }).length
      return count >= 3
    },
  },
  {
    id: 'budget_250k',
    name: '$250k Club',
    description: 'Reach $250,000 budget',
    icon: '💵',
    category: 'startup',
    condition: (state) => state.promotion.budget >= 250000,
  },
  {
    id: 'ring_master',
    name: 'Ring Master',
    description: 'Organize 50 total fights',
    icon: '🎪',
    category: 'startup',
    condition: (state) => state.totalFights >= 50,
  },
  {
    id: 'steady_hand',
    name: 'Steady Hand',
    description: 'Have 10 consecutive profitable events',
    icon: '📈',
    category: 'startup',
    condition: (state) => state.consecutiveProfitableEvents >= 10,
  },

  // TIER 2: Growth (16-35)
  {
    id: 'great_manager',
    name: 'Great Manager',
    description: 'Have 50 total organization wins',
    icon: '👨‍💼',
    category: 'growth',
    condition: (state) => {
      const totalWins = state.fighters.reduce((sum, f) => sum + (f.bilan?.v || 0), 0)
      return totalWins >= 50
    },
  },
  {
    id: 'national_presence',
    name: 'National Presence',
    description: 'Organize 30 events',
    icon: '🌍',
    category: 'growth',
    condition: (state) => state.totalEvents >= 30,
  },
  {
    id: 'star_recruiter',
    name: 'Star Recruiter',
    description: 'Recruit a champion-level fighter (Level 4+)',
    icon: '⭐⭐⭐⭐⭐',
    category: 'growth',
    condition: (state) => state.fighters.some(f => {
      const avg = (f.frappe + f.lutte + f.sol) / 3
      return avg >= 70
    }),
  },
  {
    id: 'legendary_pairing',
    name: 'Legendary Pairing',
    description: 'Have two fighters both reach Level 5',
    icon: '🏆🏆',
    category: 'growth',
    condition: (state) => {
      const champs = state.fighters.filter(f => {
        const avg = (f.frappe + f.lutte + f.sol) / 3
        return avg >= 85
      }).length
      return champs >= 2
    },
  },
  {
    id: '50_win_club',
    name: '50-Win Club',
    description: 'Have a fighter with 50+ wins',
    icon: '5️⃣0️⃣',
    category: 'growth',
    condition: (state) => state.fighters.some(f => f.bilan.v >= 50),
  },
  {
    id: 'unbreakable',
    name: 'Unbreakable',
    description: 'Have 20 consecutive profitable events',
    icon: '🔗',
    category: 'growth',
    condition: (state) => state.consecutiveProfitableEvents >= 20,
  },
  {
    id: 'tournament_victor',
    name: 'Tournament Victor',
    description: 'Win a tournament bracket event',
    icon: '🥇',
    category: 'growth',
    condition: (state) => state.tournamentWins >= 1,
  },
  {
    id: 'budget_500k',
    name: '$500k Milestone',
    description: 'Reach $500,000 budget',
    icon: '💎',
    category: 'growth',
    condition: (state) => state.promotion.budget >= 500000,
  },
  {
    id: 'business_owner',
    name: 'Business Owner',
    description: 'Establish a stable economic model',
    icon: '🏢',
    category: 'growth',
    condition: (state) => state.promotion.budget >= 250000 && state.totalEvents >= 15,
  },
  {
    id: 'rival_maker',
    name: 'Rival Maker',
    description: 'Compete against rival promotion 5 times',
    icon: '⚔️',
    category: 'growth',
    condition: (state) => state.rivalMatches >= 5,
  },

  // TIER 3: Dominance (36-50)
  {
    id: 'national_champion',
    name: 'National Champion',
    description: 'Achieve National Promoter status',
    icon: '🌟',
    category: 'dominance',
    condition: (state) => state.totalEvents >= 31,
  },
  {
    id: 'living_legend',
    name: 'Living Legend',
    description: 'Organize 50+ events',
    icon: '👑🔥',
    category: 'dominance',
    condition: (state) => state.totalEvents >= 50,
  },
  {
    id: 'hall_of_famer',
    name: 'Hall of Famer',
    description: 'Have a fighter with 100+ wins',
    icon: '🎖️',
    category: 'dominance',
    condition: (state) => state.fighters.some(f => f.bilan.v >= 100),
  },
  {
    id: 'dynasty_builder',
    name: 'Dynasty Builder',
    description: 'Have 5 fighters at Level 4+',
    icon: '👑👑👑👑👑',
    category: 'dominance',
    condition: (state) => {
      const count = state.fighters.filter(f => {
        const avg = (f.frappe + f.lutte + f.sol) / 3
        return avg >= 70
      }).length
      return count >= 5
    },
  },
  {
    id: 'budget_1m',
    name: '$1M Legend',
    description: 'Reach $1,000,000 budget',
    icon: '🏅',
    category: 'dominance',
    condition: (state) => state.promotion.budget >= 1000000,
  },
  {
    id: 'immortal_manager',
    name: 'Immortal Manager',
    description: 'Organize 75 events',
    icon: '⚡',
    category: 'dominance',
    condition: (state) => state.totalEvents >= 75,
  },
  {
    id: 'perfect_manager',
    name: 'Perfect Manager',
    description: 'Maintain 50%+ win rate for 50 events',
    icon: '📊',
    category: 'dominance',
    condition: (state) => {
      if (state.totalFights < 50) return false
      const wins = state.fighters.reduce((sum, f) => sum + (f.bilan?.v || 0), 0)
      return (wins / state.totalFights) >= 0.5
    },
  },
  {
    id: 'championship_belt',
    name: 'Championship Belt',
    description: 'Hold title for 5+ consecutive events',
    icon: '🏆',
    category: 'dominance',
    condition: (state) => state.titleConsecutive >= 5,
  },
  {
    id: 'unstoppable',
    name: 'Unstoppable',
    description: 'Have 30 consecutive profitable events',
    icon: '🚀',
    category: 'dominance',
    condition: (state) => state.consecutiveProfitableEvents >= 30,
  },
]

// Helper function to check achievements
export function checkAchievements(state, lastNet = 0) {
  const newAchievements = []

  ACHIEVEMENTS.forEach(achievement => {
    if (achievement.condition(state, lastNet)) {
      newAchievements.push(achievement.id)
    }
  })

  return newAchievements
}
