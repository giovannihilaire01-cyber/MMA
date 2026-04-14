function FightResultCard({ result, fighters, index, total }) {
  const winner = fighters.find(f => f.id === result.winnerId)
  const loser = fighters.find(f => f.id === result.loserId)
  if (!winner || !loser) return null

  const isMain = index === 0

  const methodColor = {
    KO: '#FF3B30',
    Soumission: '#FB923C',
    Décision: '#60A5FA',
  }[result.method] || '#888'

  return (
    <div
      className="rounded-lg overflow-hidden"
      style={{ border: `1px solid ${isMain ? '#333' : '#2A2A2A'}`, background: '#141414' }}
    >
      {isMain && (
        <div
          className="px-4 py-1.5 font-bold uppercase tracking-wider"
          style={{ fontSize: 10, background: 'rgba(232,255,0,0.08)', color: '#E8FF00', borderBottom: '1px solid #2A2A2A' }}
        >
          ⭐ MAIN EVENT
        </div>
      )}
      <div className="p-4 flex flex-col gap-3">
        {/* Fighters row */}
        <div className="flex items-center gap-2">
          {/* Winner */}
          <div className="flex-1 flex flex-col gap-1">
            <span className="font-bold uppercase tracking-wide text-primary text-sm leading-tight">
              {winner.nom}
            </span>
            <span
              className="rounded px-1.5 py-0.5 font-bold uppercase self-start"
              style={{ fontSize: 9, background: '#34C759', color: '#000' }}
            >
              VICTOIRE
            </span>
          </div>

          {/* VS divider */}
          <div className="flex flex-col items-center gap-1 shrink-0">
            <span className="font-bold text-secondary text-xs">VS</span>
          </div>

          {/* Loser */}
          <div className="flex-1 flex flex-col items-end gap-1">
            <span className="font-bold uppercase tracking-wide text-secondary text-sm leading-tight text-right">
              {loser.nom}
            </span>
            <span
              className="rounded px-1.5 py-0.5 font-bold uppercase self-end"
              style={{ fontSize: 9, background: '#FF3B30', color: '#fff' }}
            >
              DÉFAITE
            </span>
          </div>
        </div>

        {/* Method */}
        <div className="flex items-center justify-center gap-2 pt-1" style={{ borderTop: '1px solid #2A2A2A' }}>
          <span className="text-secondary text-xs">Victoire par</span>
          <span className="font-bold uppercase tracking-wider text-sm" style={{ color: methodColor }}>
            {result.method}
          </span>
        </div>
      </div>
    </div>
  )
}

function FinancialSummary({ financials }) {
  const { revenue, costs, net, newBudget, n } = financials
  const netPositive = net >= 0

  function fmt(n) {
    const abs = Math.abs(n)
    const sign = n >= 0 ? '+' : '-'
    return `${sign} $${abs.toLocaleString('en-US')}`
  }

  return (
    <div
      className="rounded-lg p-4 flex flex-col gap-2"
      style={{ background: '#141414', border: '1px solid #2A2A2A' }}
    >
      <span className="font-bold uppercase tracking-wider text-secondary" style={{ fontSize: 11 }}>
        Bilan financier
      </span>

      <div className="flex flex-col gap-1.5">
        <div className="flex justify-between items-center">
          <span className="text-secondary text-sm">Revenus ({n} combat{n > 1 ? 's' : ''})</span>
          <span className="font-mono font-bold text-sm" style={{ color: '#34C759' }}>
            {fmt(revenue)}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-secondary text-sm">Coût des combats</span>
          <span className="font-mono font-bold text-sm" style={{ color: '#FF3B30' }}>
            {fmt(-n * 3000)}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-secondary text-sm">Coût d'organisation</span>
          <span className="font-mono font-bold text-sm" style={{ color: '#FF3B30' }}>
            {fmt(-5000)}
          </span>
        </div>

        <div
          className="flex justify-between items-center pt-2 mt-1"
          style={{ borderTop: '1px solid #2A2A2A' }}
        >
          <span className="font-bold uppercase tracking-wide text-sm">Net</span>
          <span
            className="font-mono font-bold text-base"
            style={{ color: netPositive ? '#34C759' : '#FF3B30' }}
          >
            {fmt(net)}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="font-bold uppercase tracking-wide text-sm">Nouveau budget</span>
          <span
            className="font-mono font-bold text-base"
            style={{ color: newBudget <= 0 ? '#FF3B30' : newBudget < 20000 ? '#FF3B30' : '#E8FF00' }}
          >
            ${Math.max(0, newBudget).toLocaleString('en-US')}
          </span>
        </div>
      </div>
    </div>
  )
}

export default function Results({ results, financials, fighters, onNewEvent }) {
  return (
    <div className="flex flex-col" style={{ minHeight: 'calc(100vh - 112px)' }}>
      <div className="flex-1 overflow-y-auto px-4 pt-4 pb-4 flex flex-col gap-3">
        <h2 className="font-bold uppercase tracking-wider text-primary text-sm">
          Résultats · {results.length} combat{results.length > 1 ? 's' : ''}
        </h2>

        {results.map((r, i) => (
          <FightResultCard
            key={i}
            result={r}
            fighters={fighters}
            index={i}
            total={results.length}
          />
        ))}

        <FinancialSummary financials={financials} />
      </div>

      <div className="px-4 py-3" style={{ borderTop: '1px solid #2A2A2A', background: '#0A0A0A' }}>
        {financials.newBudget <= 0 ? (
          <div
            className="w-full py-4 rounded-lg font-bold uppercase tracking-wider text-sm text-center"
            style={{ background: 'rgba(255,59,48,0.15)', color: '#FF3B30', border: '1px solid #FF3B30' }}
          >
            FAILLITE — FIN DE PARTIE
          </div>
        ) : (
          <button
            onClick={onNewEvent}
            className="w-full py-4 rounded-lg font-bold uppercase tracking-wider text-sm"
            style={{ background: '#E8FF00', color: '#000' }}
          >
            NOUVEL ÉVÉNEMENT
          </button>
        )}
      </div>
    </div>
  )
}
