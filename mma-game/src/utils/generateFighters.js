const FIRST_NAMES = [
  'Alex', 'Marcus', 'Carlos', 'Ivan', 'Dmitri', 'Kenji', 'Ahmed', 'Liam',
  'Santiago', 'Yusuf', 'Tomas', 'Rafael', 'Andre', 'Viktor', 'Jin', 'Mateo',
  'Kofi', 'Ryu', 'Nikolai', 'Hassan', 'Diego', 'Emil', 'Tariq', 'Brendan',
  'Oscar', 'Lucas', 'Felipe', 'Javier', 'Seun', 'Arjun', 'Maxim', 'Caden',
]

const LAST_NAMES = [
  'Martinez', 'Chen', 'Petrov', 'Silva', 'Tanaka', 'Hassan', 'Murphy',
  'Reyes', 'Volkov', 'Park', 'Santos', 'Okafor', 'Nakamura', 'Diaz',
  'Kovač', 'Andrade', 'Ferreira', 'Kim', 'Moreira', 'Ibragimov',
  'Souza', 'Jensen', 'Castillo', 'Rashid', 'Torres', 'Gomes', 'Walsh',
  'Yamamoto', 'Nkosi', 'Patel', 'Romero', 'Larsson',
]

const usedNames = new Set()

function uniqueName() {
  let name
  let attempts = 0
  do {
    const first = FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)]
    const last = LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)]
    name = `${first} ${last}`
    attempts++
  } while (usedNames.has(name) && attempts < 100)
  usedNames.add(name)
  return name
}

function randStat(tier = 'standard') {
  // Different stat ranges based on recruitment tier
  const ranges = {
    cheap: { min: 30, max: 50 },      // 30-50 (rookies)
    standard: { min: 40, max: 70 },   // 40-70 (current system)
    star: { min: 60, max: 85 },       // 60-85 (champions)
  }
  const range = ranges[tier] || ranges.standard
  return Math.floor(Math.random() * (range.max - range.min + 1)) + range.min
}

export function generateFighter(tier = 'standard') {
  return {
    id: crypto.randomUUID(),
    nom: uniqueName(),
    frappe: randStat(tier),
    lutte: randStat(tier),
    sol: randStat(tier),
    bilan: { v: 0, d: 0 },
  }
}

export function generateFighters(n = 16, tier = 'standard') {
  usedNames.clear()
  return Array.from({ length: n }, () => generateFighter(tier))
}

export function generateRecruits(existingNames = [], tier = 'standard') {
  existingNames.forEach(n => usedNames.add(n))
  const recruits = Array.from({ length: 3 }, () => generateFighter(tier))
  existingNames.forEach(n => usedNames.delete(n))
  return recruits
}

// Recruitment tiers with costs
export const RECRUITMENT_TIERS = [
  { id: 'cheap', label: 'Cheap', cost: 10000, tier: 'cheap', description: 'Rookies (stats 30-50)' },
  { id: 'standard', label: 'Standard', cost: 15000, tier: 'standard', description: 'Mid-level (stats 40-70)' },
  { id: 'star', label: 'Star', cost: 25000, tier: 'star', description: 'Champions (stats 60-85)' },
]
