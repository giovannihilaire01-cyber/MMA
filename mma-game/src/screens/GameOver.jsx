export default function GameOver({ totalEvents, totalFights, fighters, onNewGame }) {
  // Find best fighter by total stats
  const best = fighters.length > 0
    ? fighters.reduce((a, b) =>
        (a.frappe + a.lutte + a.sol + a.bilan.v * 5) >
        (b.frappe + b.lutte + b.sol + b.bilan.v * 5) ? a : b
      )
    : null

  return (
    <div
      className="flex flex-col items-center justify-center px-6 text-center"
      style={{ minHeight: '100dvh', minHeight: '100vh', background: '#0A0A0A' }}
    >
      <div className="w-full max-w-sm flex flex-col gap-8">
        {/* Title */}
        <div className="flex flex-col gap-3">
          <div
            className="font-bold uppercase tracking-widest"
            style={{ fontSize: 48, color: '#FF3B30', lineHeight: 1 }}
          >
            FAILLITE
          </div>
          <p className="text-secondary text-sm">
            Ta promotion n'a pas survécu.
          </p>
        </div>

        {/* Stats */}
        <div
          className="rounded-xl p-5 flex flex-col gap-4"
          style={{ background: '#141414', border: '1px solid #2A2A2A' }}
        >
          <div className="flex justify-between items-center">
            <span className="text-secondary text-sm uppercase tracking-wide">Événements organisés</span>
            <span className="font-mono font-bold text-xl text-primary">{totalEvents}</span>
          </div>
          <div
            className="flex justify-between items-center"
            style={{ borderTop: '1px solid #2A2A2A', paddingTop: 16 }}
          >
            <span className="text-secondary text-sm uppercase tracking-wide">Combats simulés</span>
            <span className="font-mono font-bold text-xl text-primary">{totalFights}</span>
          </div>

          {best && (
            <div
              className="flex flex-col gap-1 rounded-lg p-3"
              style={{ borderTop: '1px solid #2A2A2A', paddingTop: 16, marginTop: 0 }}
            >
              <span className="text-secondary uppercase tracking-wide" style={{ fontSize: 10 }}>
                Meilleur combattant
              </span>
              <span className="font-bold uppercase tracking-wider text-primary text-sm">
                {best.nom}
              </span>
              <span className="font-mono text-secondary" style={{ fontSize: 11 }}>
                {best.bilan.v}V · {best.bilan.d}D · Frappe {best.frappe} / Lutte {best.lutte} / Sol {best.sol}
              </span>
            </div>
          )}
        </div>

        {/* CTA */}
        <button
          onClick={onNewGame}
          className="w-full py-4 rounded-lg font-bold uppercase tracking-wider text-sm"
          style={{ background: '#E8FF00', color: '#000' }}
        >
          NOUVELLE PARTIE
        </button>

        <p className="text-secondary" style={{ fontSize: 10 }}>
          Toute progression sera effacée
        </p>
      </div>
    </div>
  )
}
