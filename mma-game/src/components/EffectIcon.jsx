import { useState, useRef, useEffect } from 'react'

const EFFECT_CONFIG = {
  suspension: { icon: '🚫', label: 'Suspension' },
  blessure:   { icon: '🩹', label: 'Blessure' },
  meforme:    { icon: '📉', label: 'Méforme' },
  sponsor:    { icon: '⭐', label: 'Sponsor' },
}

export default function EffectIcon({ effect }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    if (!open) return
    function onDoc(e) { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('click', onDoc)
    return () => document.removeEventListener('click', onDoc)
  }, [open])

  const cfg = EFFECT_CONFIG[effect.type] || { icon: '✨', label: effect.type }

  function toggle(e) {
    e.stopPropagation()
    setOpen(v => !v)
  }

  return (
    <span ref={ref} className="relative inline-flex items-center">
      <button
        onClick={toggle}
        className="inline-flex items-center justify-center rounded"
        style={{ fontSize: 12, width: 18, height: 18, background: '#1E1E1E', border: '1px solid #333', padding: 0 }}
      >
        {cfg.icon}
      </button>
      {open && (
        <span
          className="absolute rounded px-2 py-1 font-bold uppercase whitespace-nowrap"
          style={{
            bottom: 'calc(100% + 4px)',
            left: 0,
            fontSize: 9,
            background: '#0A0A0A',
            color: '#E8FF00',
            border: '1px solid #2A2A2A',
            zIndex: 60,
          }}
        >
          {cfg.label} · {effect.remainingEvents} event{effect.remainingEvents > 1 ? 's' : ''}
        </span>
      )}
    </span>
  )
}
