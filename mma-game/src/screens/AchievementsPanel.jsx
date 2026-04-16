import { ACHIEVEMENTS, checkAchievements } from '../data/achievements'

export default function AchievementsPanel({ state, earnedAchievements = [] }) {
  // Group achievements by category
  const categories = {
    startup: { label: 'Démarrage', color: '#E8FF00' },
    growth: { label: 'Croissance', color: '#34C759' },
    dominance: { label: 'Dominance', color: '#FF3B30' },
  }

  return (
    <div className="flex flex-col h-full p-4" style={{ minHeight: 'calc(100vh - 112px)', background: '#0A0A0A' }}>
      <h2 className="font-bold uppercase tracking-wider text-primary text-lg mb-4">
        🏆 Accomplissements
      </h2>

      {Object.entries(categories).map(([catKey, catInfo]) => {
        const catAchievements = ACHIEVEMENTS.filter(a => a.category === catKey)
        const earnedCount = catAchievements.filter(a => earnedAchievements.includes(a.id)).length

        return (
          <div key={catKey} className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <span style={{ color: catInfo.color }} className="font-bold uppercase tracking-wide text-sm">
                {catInfo.label}
              </span>
              <span className="text-secondary text-xs">
                {earnedCount} / {catAchievements.length}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {catAchievements.map(achievement => {
                const earned = earnedAchievements.includes(achievement.id)
                return (
                  <div
                    key={achievement.id}
                    className="rounded-lg p-3 flex flex-col items-center gap-2 text-center"
                    style={{
                      background: earned ? 'rgba(232,255,0,0.1)' : '#141414',
                      border: `1px solid ${earned ? catInfo.color : '#2A2A2A'}`,
                      opacity: earned ? 1 : 0.3,
                    }}
                    title={achievement.description}
                  >
                    <span style={{ fontSize: 24 }}>{achievement.icon}</span>
                    <span className="text-xs font-bold leading-tight text-primary">
                      {achievement.name}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}
