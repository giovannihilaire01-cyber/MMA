export default function Statistics({ state }) {
  const { promotion, fighters, totalEvents, totalFights } = state

  // Calculate stats
  const totalWins = fighters.reduce((sum, f) => sum + (f.bilan?.v || 0), 0)
  const totalLosses = fighters.reduce((sum, f) => sum + (f.bilan?.d || 0), 0)
  const winRate = totalFights > 0 ? Math.round((totalWins / totalFights) * 100) : 0

  // Find best fighter
  const bestFighter = fighters.reduce((best, f) => {
    const bestWins = best.bilan?.v || 0
    const fWins = f.bilan?.v || 0
    return fWins > bestWins ? f : best
  }, fighters[0] || {})

  // Find highest stat fighter
  const statsAce = fighters.reduce((best, f) => {
    const bestAvg = (best.frappe || 0 + best.lutte || 0 + best.sol || 0) / 3
    const fAvg = (f.frappe + f.lutte + f.sol) / 3
    return fAvg > bestAvg ? f : best
  }, fighters[0] || {})

  return (
    <div className="flex flex-col p-4" style={{ minHeight: 'calc(100vh - 112px)', background: '#0A0A0A' }}>
      <h2 className="font-bold uppercase tracking-wider text-primary text-lg mb-4">
        📊 Statistiques
      </h2>

      {/* Organization Stats */}
      <div className="rounded-lg p-4 mb-4" style={{ background: '#141414', border: '1px solid #2A2A2A' }}>
        <h3 className="font-bold uppercase tracking-wide text-sm mb-3" style={{ color: '#E8FF00' }}>
          Organisation
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-secondary text-xs mb-1">Budget Actuel</div>
            <div className="font-bold text-lg" style={{ color: '#E8FF00' }}>
              ${(promotion.budget / 1000).toFixed(0)}k
            </div>
          </div>
          <div>
            <div className="text-secondary text-xs mb-1">Événements Organisés</div>
            <div className="font-bold text-lg" style={{ color: '#60A5FA' }}>
              {totalEvents}
            </div>
          </div>
          <div>
            <div className="text-secondary text-xs mb-1">Combats Totaux</div>
            <div className="font-bold text-lg" style={{ color: '#FB923C' }}>
              {totalFights}
            </div>
          </div>
          <div>
            <div className="text-secondary text-xs mb-1">Taux de Victoire</div>
            <div className="font-bold text-lg" style={{ color: winRate >= 50 ? '#34C759' : '#FF3B30' }}>
              {winRate}%
            </div>
          </div>
        </div>
      </div>

      {/* Combat Stats */}
      <div className="rounded-lg p-4 mb-4" style={{ background: '#141414', border: '1px solid #2A2A2A' }}>
        <h3 className="font-bold uppercase tracking-wide text-sm mb-3" style={{ color: '#E8FF00' }}>
          Résultats
        </h3>
        <div className="flex gap-4">
          <div className="flex-1">
            <div className="text-secondary text-xs mb-1">Victoires</div>
            <div className="font-bold text-xl" style={{ color: '#34C759' }}>
              {totalWins}
            </div>
          </div>
          <div className="flex-1">
            <div className="text-secondary text-xs mb-1">Défaites</div>
            <div className="font-bold text-xl" style={{ color: '#FF3B30' }}>
              {totalLosses}
            </div>
          </div>
          <div className="flex-1">
            <div className="text-secondary text-xs mb-1">Bilan</div>
            <div className="font-bold text-xl" style={{ color: '#60A5FA' }}>
              {totalWins}V · {totalLosses}D
            </div>
          </div>
        </div>
      </div>

      {/* Top Fighters */}
      {bestFighter.nom && (
        <div className="rounded-lg p-4 mb-4" style={{ background: '#141414', border: '1px solid #2A2A2A' }}>
          <h3 className="font-bold uppercase tracking-wide text-sm mb-3" style={{ color: '#E8FF00' }}>
            🏆 Meilleur Combattant
          </h3>
          <div className="flex items-center justify-between">
            <div>
              <div className="font-bold text-primary">{bestFighter.nom}</div>
              <div className="text-secondary text-sm">
                {bestFighter.bilan?.v || 0}V · {bestFighter.bilan?.d || 0}D
              </div>
            </div>
            <div className="text-right">
              <div className="font-mono font-bold" style={{ color: '#E8FF00' }}>
                {bestFighter.bilan?.v || 0} wins
              </div>
            </div>
          </div>
        </div>
      )}

      {statsAce.nom && statsAce.nom !== bestFighter.nom && (
        <div className="rounded-lg p-4 mb-4" style={{ background: '#141414', border: '1px solid #2A2A2A' }}>
          <h3 className="font-bold uppercase tracking-wide text-sm mb-3" style={{ color: '#E8FF00' }}>
            ⭐ Combattant le Plus Fort
          </h3>
          <div className="flex items-center justify-between">
            <div>
              <div className="font-bold text-primary">{statsAce.nom}</div>
              <div className="text-secondary text-sm">
                {statsAce.frappe} / {statsAce.lutte} / {statsAce.sol}
              </div>
            </div>
            <div className="text-right">
              <div className="font-mono font-bold" style={{ color: '#FB923C' }}>
                Avg: {((statsAce.frappe + statsAce.lutte + statsAce.sol) / 3).toFixed(0)}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Roster Stats */}
      <div className="rounded-lg p-4" style={{ background: '#141414', border: '1px solid #2A2A2A' }}>
        <h3 className="font-bold uppercase tracking-wide text-sm mb-3" style={{ color: '#E8FF00' }}>
          📋 Roster
        </h3>
        <div className="text-sm text-secondary">
          Total Combattants: <span className="font-bold text-primary">{fighters.length}</span>
        </div>
      </div>
    </div>
  )
}
