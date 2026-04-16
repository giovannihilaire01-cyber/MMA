import { COSMETICS, isCosmeticUnlocked } from '../data/cosmetics'

export default function Cosmetics({ state }) {
  const unlockedCosmetics = COSMETICS.filter(c => isCosmeticUnlocked(c, state))
  const lockedCosmetics = COSMETICS.filter(c => !isCosmeticUnlocked(c, state))

  const categories = {
    ring: { label: 'Rings', color: '#E8FF00' },
    entrance: { label: 'Entrance', color: '#60A5FA' },
    cosmetic: { label: 'Cosmetics', color: '#FB923C' },
    badge: { label: 'Badges', color: '#34C759' },
  }

  return (
    <div className="flex flex-col p-4" style={{ minHeight: 'calc(100vh - 112px)', background: '#0A0A0A' }}>
      <h2 className="font-bold uppercase tracking-wider text-primary text-lg mb-4">
        ✨ Cosmétiques
      </h2>

      {/* Unlocked */}
      {unlockedCosmetics.length > 0 && (
        <div className="mb-6">
          <h3 className="font-bold uppercase tracking-wide text-sm mb-3" style={{ color: '#34C759' }}>
            🎉 Déverrouillé ({unlockedCosmetics.length})
          </h3>
          <div className="grid grid-cols-3 gap-3">
            {unlockedCosmetics.map(cosmetic => {
              const cat = categories[cosmetic.category]
              return (
                <div
                  key={cosmetic.id}
                  className="rounded-lg p-3 flex flex-col items-center gap-2 text-center"
                  style={{
                    background: 'rgba(52,199,89,0.1)',
                    border: '2px solid #34C759',
                  }}
                >
                  <span style={{ fontSize: 32 }}>{cosmetic.icon}</span>
                  <div className="text-xs leading-tight">
                    <div className="font-bold text-primary">{cosmetic.name}</div>
                    <div className="text-secondary" style={{ fontSize: 10 }}>
                      {cat.label}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Locked */}
      {lockedCosmetics.length > 0 && (
        <div>
          <h3 className="font-bold uppercase tracking-wide text-sm mb-3" style={{ color: '#888' }}>
            🔒 Verrouillé ({lockedCosmetics.length})
          </h3>
          <div className="grid grid-cols-3 gap-3">
            {lockedCosmetics.map(cosmetic => {
              const cat = categories[cosmetic.category]
              let unlockText = ''
              if (cosmetic.unlockedAt.type === 'budget') {
                unlockText = `$${(cosmetic.unlockedAt.value / 1000).toFixed(0)}k`
              } else if (cosmetic.unlockedAt.type === 'events') {
                unlockText = `${cosmetic.unlockedAt.value} ev.`
              }

              return (
                <div
                  key={cosmetic.id}
                  className="rounded-lg p-3 flex flex-col items-center gap-2 text-center"
                  style={{
                    background: '#141414',
                    border: '1px solid #2A2A2A',
                    opacity: 0.5,
                  }}
                >
                  <span style={{ fontSize: 24, opacity: 0.5 }}>{cosmetic.icon}</span>
                  <div className="text-xs leading-tight">
                    <div className="font-bold text-primary" style={{ opacity: 0.7 }}>{cosmetic.name}</div>
                    <div className="text-secondary" style={{ fontSize: 10, opacity: 0.7 }}>
                      {unlockText}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
