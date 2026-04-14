import { useEffect } from 'react'

const LEVEL_CONFIG = {
  1: { icon: '⚠️', color: '#888888' },
  2: { icon: '⚠️', color: '#E8FF00' },
  3: { icon: '🔴', color: '#FF3B30' },
}

export default function ForeshadowingBar({ warnings = [], onDismiss }) {
  useEffect(() => {
    if (warnings.length === 0) return
    const timers = warnings.map(w =>
      setTimeout(() => onDismiss && onDismiss(w.id), 4000)
    )
    return () => timers.forEach(clearTimeout)
  }, [warnings, onDismiss])

  if (warnings.length === 0) return null

  // Show the highest-level warning (most urgent)
  const current = warnings.reduce((a, b) => (a.level >= b.level ? a : b))
  const cfg = LEVEL_CONFIG[current.level] || LEVEL_CONFIG[1]

  return (
    <div
      className="fixed left-0 right-0 z-40 flex items-center px-4"
      style={{
        bottom: 56,
        height: 36,
        background: '#1A1A1A',
        borderTop: '1px solid #2A2A2A',
      }}
    >
      <span style={{ fontSize: 14, marginRight: 8 }}>{cfg.icon}</span>
      <span
        className="uppercase tracking-wider font-bold truncate"
        style={{ fontSize: 11, color: cfg.color }}
      >
        {current.text}
      </span>
    </div>
  )
}
