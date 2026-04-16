const TABS = [
  { id: 'roster', label: 'Roster', icon: '👥' },
  { id: 'matchmaking', label: 'Événement', icon: '🥊' },
  { id: 'results', label: 'Résultats', icon: '📋' },
  { id: 'achievements', label: 'Achievements', icon: '🏆' },
  { id: 'statistics', label: 'Stats', icon: '📊' },
  { id: 'history', label: 'Historique', icon: '📜' },
]

export default function BottomNav({ active, hasResults, onChange }) {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 flex border-t border-border bg-surface"
      style={{ height: 56 }}
    >
      {TABS.map(tab => {
        const isActive = active === tab.id
        const disabled = tab.id === 'results' && !hasResults
        return (
          <button
            key={tab.id}
            onClick={() => !disabled && onChange(tab.id)}
            disabled={disabled}
            className="flex-1 flex flex-col items-center justify-center gap-0.5 text-xs transition-colors"
            style={{
              color: isActive ? '#E8FF00' : disabled ? '#444' : '#888888',
              background: isActive ? 'rgba(232,255,0,0.04)' : 'transparent',
              border: 'none',
              cursor: disabled ? 'default' : 'pointer',
            }}
          >
            <span className="text-base leading-none">{tab.icon}</span>
            <span className="uppercase tracking-wider font-bold" style={{ fontSize: 10 }}>
              {tab.label}
            </span>
          </button>
        )
      })}
    </nav>
  )
}
