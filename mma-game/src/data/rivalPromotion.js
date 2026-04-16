// Rival Promotions System

const RIVAL_NAMES = [
  'TITAN FC',
  'APEX WARRIORS',
  'ELITE COMBAT',
  'CHAMPIONS LEAGUE',
  'IRON FIST',
  'THUNDER DOME',
  'WARRIOR KINGDOM',
  'LEGEND FIGHT',
  'OMEGA PROMOTIONS',
  'ZENITH SPORTS',
]

// Generate a rival promotion
export function generateRivalPromotion() {
  const name = RIVAL_NAMES[Math.floor(Math.random() * RIVAL_NAMES.length)]
  return {
    id: `rival_${Date.now()}`,
    name,
    introduced_at_event: 0,
    matches: 0,
    wins: 0,
    losses: 0,
  }
}

// Create or update rival
export function initializeRival(state) {
  if (state.totalEvents >= 20 && !state.rivalPromotion) {
    return generateRivalPromotion()
  }
  return state.rivalPromotion || null
}

// Match result impact
export function processRivalMatch(state, isWin) {
  if (!state.rivalPromotion) return state.rivalPromotion

  return {
    ...state.rivalPromotion,
    matches: state.rivalPromotion.matches + 1,
    wins: isWin ? state.rivalPromotion.wins + 1 : state.rivalPromotion.wins,
    losses: !isWin ? state.rivalPromotion.losses + 1 : state.rivalPromotion.losses,
  }
}
