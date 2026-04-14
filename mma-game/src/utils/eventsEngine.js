// Pure functions for the contextual events pipeline.
// All functions accept an injectable rng (defaults to Math.random) for testability.

import { EVENTS_CATALOG, RARITY_WEIGHTS } from '../data/eventsCatalog'
import { generateFighter } from './generateFighters'

const TRIGGER_CHANCE = 0.6

export function shouldTrigger(rng = Math.random) {
  return rng() < TRIGGER_CHANCE
}

export function filterEligible(catalog, cooldowns, nbJoues) {
  return catalog.filter(ev => {
    if (nbJoues < ev.deblocage) return false
    const cd = cooldowns[ev.id]
    if (cd && cd > nbJoues) return false
    return true
  })
}

export function computeRatio(budget) {
  if (budget < 20000) return 0.8
  if (budget < 50000) return 0.65
  if (budget < 100000) return 0.5
  if (budget < 150000) return 0.35
  return 0.2
}

export function partitionByNature(events) {
  const pos = [], neg = []
  for (const e of events) {
    if (e.nature === 'positif') pos.push(e)
    else neg.push(e)
  }
  return { pos, neg }
}

export function weightedPickByRarity(events, rng = Math.random) {
  if (events.length === 0) return null
  const total = events.reduce((s, e) => s + (RARITY_WEIGHTS[e.rarete] || 1), 0)
  let r = rng() * total
  for (const e of events) {
    r -= RARITY_WEIGHTS[e.rarete] || 1
    if (r <= 0) return e
  }
  return events[events.length - 1]
}

export function computeAmplitude(event, nbJoues, rng = Math.random) {
  const { valeur_min, valeur_max } = event.impact
  const base = valeur_min + rng() * (valeur_max - valeur_min)
  const scaling = Math.min(1 + nbJoues * 0.03, 2.5)
  return Math.round(base * scaling)
}

function scoreFighter(f) {
  return f.frappe * 0.4 + f.lutte * 0.3 + f.sol * 0.3
}

function bilanScore(f) {
  return (f.bilan?.v || 0) - (f.bilan?.d || 0)
}

export function resolveTarget(fighters, cible, rng = Math.random, excludeIds = []) {
  const pool = fighters.filter(f => !excludeIds.includes(f.id))
  if (pool.length === 0) return null
  switch (cible) {
    case 'meilleur_fighter': return pool.reduce((a, b) => scoreFighter(a) >= scoreFighter(b) ? a : b)
    case 'pire_fighter':    return pool.reduce((a, b) => scoreFighter(a) <= scoreFighter(b) ? a : b)
    case 'meilleur_bilan':  return pool.reduce((a, b) => bilanScore(a) >= bilanScore(b) ? a : b)
    case 'pire_bilan':      return pool.reduce((a, b) => bilanScore(a) <= bilanScore(b) ? a : b)
    case 'random':
    default:
      return pool[Math.floor(rng() * pool.length)]
  }
}

function clamp(v, min, max) { return Math.max(min, Math.min(max, v)) }

// Apply impact to a snapshot of state. Returns { state, summary }.
// NOTE: mutates nothing — returns a new gameState-like object (partial fields used).
export function applyImpact({ fighters, budget }, event, value, target) {
  const { type, stat } = event.impact
  const summary = { delta: value, fighterName: null, type, stat }
  let newFighters = fighters
  let newBudget = budget

  if (type === 'budget') {
    newBudget = budget + value
  } else if (type === 'stats' && target) {
    summary.fighterName = target.nom
    newFighters = fighters.map(f => {
      if (f.id !== target.id) return f
      const copy = { ...f }
      if (stat && ['frappe', 'lutte', 'sol'].includes(stat)) {
        const proportional = Math.round(value * (copy[stat] / 100))
        copy[stat] = clamp(copy[stat] + proportional, 1, 99)
      } else {
        // Apply proportionally to ALL three stats
        for (const s of ['frappe', 'lutte', 'sol']) {
          const proportional = Math.round(value * (copy[s] / 100))
          copy[s] = clamp(copy[s] + proportional, 1, 99)
        }
      }
      return copy
    })
  } else if (type === 'roster') {
    // Positive value => add a recruit with approximate level `value`.
    // Zero/negative => remove target fighter.
    if (value > 0) {
      const level = clamp(value, 40, 90)
      const newFighter = generateFighter()
      // scale generated fighter's stats toward the desired level
      const avg = (newFighter.frappe + newFighter.lutte + newFighter.sol) / 3
      const scale = level / (avg || 1)
      newFighter.frappe = clamp(Math.round(newFighter.frappe * scale), 1, 99)
      newFighter.lutte = clamp(Math.round(newFighter.lutte * scale), 1, 99)
      newFighter.sol = clamp(Math.round(newFighter.sol * scale), 1, 99)
      newFighters = [...fighters, newFighter]
      summary.fighterName = newFighter.nom
      summary.delta = `+${newFighter.nom}`
    } else if (target) {
      summary.fighterName = target.nom
      summary.delta = `-${target.nom}`
      newFighters = fighters.filter(f => f.id !== target.id)
    }
  } else if (type === 'combo' && target) {
    // combo = budget + small stat boost/penalty on target
    summary.fighterName = target.nom
    newBudget = budget + value
    const statDelta = value > 0 ? 2 : -2
    newFighters = fighters.map(f => {
      if (f.id !== target.id) return f
      const copy = { ...f }
      for (const s of ['frappe', 'lutte', 'sol']) {
        copy[s] = clamp(copy[s] + statDelta, 1, 99)
      }
      return copy
    })
  }

  return { fighters: newFighters, budget: newBudget, summary }
}

// Decrement remainingEvents on every active effect, apply recurring impact,
// remove expired. Returns { activeEffects, fighters, budget } updated.
export function tickActiveEffects(state) {
  let { activeEffects, fighters, budget } = state
  const next = []
  for (const eff of activeEffects) {
    const remaining = eff.remainingEvents - 1
    // Recurring impact: slow drain for blessure/meforme, static for suspension/sponsor
    if (remaining > 0 && (eff.type === 'blessure' || eff.type === 'meforme')) {
      fighters = fighters.map(f => {
        if (f.id !== eff.fighterId) return f
        const copy = { ...f }
        for (const s of ['frappe', 'lutte', 'sol']) {
          copy[s] = clamp(copy[s] - 1, 1, 99)
        }
        return copy
      })
    }
    if (remaining > 0 && eff.type === 'sponsor') {
      budget += 2000 // small recurring bonus
    }
    if (remaining > 0) next.push({ ...eff, remainingEvents: remaining })
  }
  return { activeEffects: next, fighters, budget }
}

export function interpolateDescription(description, ctx) {
  if (!description) return ''
  return description
    .replace(/\[PROMOTION\]/g, ctx.promotion || '')
    .replace(/\[FIGHTER\]/g, ctx.fighter || '')
    .replace(/\[MONTANT\]/g, ctx.montant || '')
}

// Orchestrator: returns { event, value, target, interpolated } or null.
export function pickContextualEvent({ catalog = EVENTS_CATALOG, state, rng = Math.random }) {
  if (!shouldTrigger(rng)) return null

  const eligible = filterEligible(catalog, state.eventCooldowns || {}, state.nbEvenementsJoues || 0)
  if (eligible.length === 0) return null

  const { pos, neg } = partitionByNature(eligible)
  const ratio = computeRatio(state.promotion.budget)
  const wantPositive = rng() < ratio
  let bucket = wantPositive ? pos : neg
  if (bucket.length === 0) bucket = wantPositive ? neg : pos
  if (bucket.length === 0) return null

  const chosen = weightedPickByRarity(bucket, rng)
  if (!chosen) return null

  const value = computeAmplitude(chosen, state.nbEvenementsJoues || 0, rng)
  const target = resolveTarget(state.fighters, chosen.impact.cible, rng,
    (state.activeEffects || []).filter(e => e.type === 'suspension').map(e => e.fighterId))

  const montant = chosen.impact.type === 'budget' || chosen.impact.type === 'combo'
    ? `$${Math.abs(value).toLocaleString('en-US')}`
    : `${value > 0 ? '+' : ''}${value}`

  const interpolated = interpolateDescription(chosen.description, {
    promotion: state.promotion.nom,
    fighter: target ? target.nom : '',
    montant,
  })

  return { event: chosen, value, target, interpolated }
}

// Plan foreshadowing warnings before a rare/legendary.
// Simple heuristic: at 30% chance, emit level-1 warning; escalate over 3 events.
export function planForeshadowing(state, rng = Math.random) {
  // If there are already pending warnings, escalate the first one
  const current = state.pendingWarnings || []
  if (current.length > 0) {
    const next = current.map(w => ({ ...w, level: Math.min(w.level + 1, 3) }))
    return next
  }
  // Otherwise with low probability, seed a new warning
  if (rng() < 0.15) {
    return [{
      id: `warn_${Date.now()}`,
      level: 1,
      text: 'Des tensions montent dans les coulisses...',
    }]
  }
  return current
}

