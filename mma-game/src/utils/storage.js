const KEY = 'mma_save'

export function saveGame(state) {
  try {
    localStorage.setItem(KEY, JSON.stringify(state))
  } catch (e) {
    console.warn('Save failed', e)
  }
}

export function loadGame() {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? JSON.parse(raw) : null
  } catch (e) {
    return null
  }
}

export function clearGame() {
  localStorage.removeItem(KEY)
}
