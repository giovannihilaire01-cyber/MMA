function calcScore(fighter) {
  const random = Math.random() * 15
  return fighter.frappe * 0.4 + fighter.lutte * 0.3 + fighter.sol * 0.3 + random
}

function getMethod(winner) {
  const { frappe, lutte, sol } = winner
  if (frappe > lutte && frappe > sol) return 'KO'
  if (sol > frappe && sol > lutte) return 'Soumission'
  return 'Décision'
}

function clamp(val, min, max) {
  return Math.max(min, Math.min(max, val))
}

// Calculate fighter level based on average stats
export function calculateFighterLevel(fighter) {
  const avgStat = (fighter.frappe + fighter.lutte + fighter.sol) / 3

  const levels = [
    { level: 5, title: 'Champion', stars: '🏆', minAvg: 85 },
    { level: 4, title: 'Elite', stars: '⭐⭐⭐⭐⭐', minAvg: 70 },
    { level: 3, title: 'Professional', stars: '⭐⭐⭐⭐', minAvg: 55 },
    { level: 2, title: 'Prospect', stars: '⭐⭐⭐', minAvg: 40 },
    { level: 1, title: 'Amateur', stars: '⭐⭐', minAvg: 25 },
    { level: 0, title: 'Novice', stars: '⭐', minAvg: 0 },
  ]

  for (const lvl of levels) {
    if (avgStat >= lvl.minAvg) {
      return { ...lvl, avgStat }
    }
  }
  return { level: 0, title: 'Novice', stars: '⭐', avgStat }
}

function applyProgression(fighter, won) {
  const f = { ...fighter }
  if (won) {
    const stats = ['frappe', 'lutte', 'sol']
    const best = stats.reduce((a, b) => (f[a] >= f[b] ? a : b))
    const gain = Math.floor(Math.random() * 3) + 2 // 2–4
    f[best] = clamp(f[best] + gain, 0, 99)
    f.bilan = { ...f.bilan, v: f.bilan.v + 1 }
  } else {
    const stats = ['frappe', 'lutte', 'sol']
    const worst = stats.reduce((a, b) => (f[a] <= f[b] ? a : b))
    f[worst] = clamp(f[worst] - 1, 0, 99)
    f.bilan = { ...f.bilan, d: f.bilan.d + 1 }
  }
  return f
}

export function simulateFight(fighter1, fighter2) {
  const score1 = calcScore(fighter1)
  const score2 = calcScore(fighter2)

  const winner = score1 >= score2 ? fighter1 : fighter2
  const loser = score1 >= score2 ? fighter2 : fighter1
  const method = getMethod(winner)

  const updatedWinner = applyProgression(winner, true)
  const updatedLoser = applyProgression(loser, false)

  return {
    winnerId: winner.id,
    loserId: loser.id,
    method,
    updatedFighters: [updatedWinner, updatedLoser],
  }
}

export function simulateEvent(matchups, fighters) {
  const results = []
  let updatedRoster = [...fighters]

  for (const { fighter1Id, fighter2Id } of matchups) {
    const f1 = updatedRoster.find(f => f.id === fighter1Id)
    const f2 = updatedRoster.find(f => f.id === fighter2Id)
    if (!f1 || !f2) continue

    const result = simulateFight(f1, f2)
    results.push(result)

    updatedRoster = updatedRoster.map(f => {
      const updated = result.updatedFighters.find(u => u.id === f.id)
      return updated || f
    })
  }

  return { results, updatedRoster }
}
