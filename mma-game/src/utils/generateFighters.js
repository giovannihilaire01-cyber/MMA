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

function randStat() {
  return Math.floor(Math.random() * 51) + 40 // 40–90
}

function generateFighter() {
  return {
    id: crypto.randomUUID(),
    nom: uniqueName(),
    frappe: randStat(),
    lutte: randStat(),
    sol: randStat(),
    bilan: { v: 0, d: 0 },
  }
}

export function generateFighters(n = 16) {
  usedNames.clear()
  return Array.from({ length: n }, generateFighter)
}

export function generateRecruits(existingNames = []) {
  existingNames.forEach(n => usedNames.add(n))
  const recruits = Array.from({ length: 3 }, generateFighter)
  existingNames.forEach(n => usedNames.delete(n))
  return recruits
}
