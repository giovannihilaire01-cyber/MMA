import { FAMILY_LABELS, RARITY_LABELS } from '../data/eventsCatalog'

function ImpactBadge({ value, type, positive }) {
  const sign = positive ? '+' : '−'
  const color = positive ? '#34C759' : '#FF3B30'
  let label
  if (type === 'budget' || type === 'combo') {
    label = `${sign} $${Math.abs(value).toLocaleString('en-US')}`
  } else if (type === 'stats') {
    label = `${sign} ${Math.abs(value)} pts`
  } else {
    label = positive ? '+ ROSTER' : '− ROSTER'
  }
  return (
    <span
      className="rounded px-2 py-0.5 font-bold uppercase"
      style={{ fontSize: 10, background: positive ? 'rgba(52,199,89,0.12)' : 'rgba(255,59,48,0.12)', color }}
    >
      {label}
    </span>
  )
}

export default function ContextualEventCard({
  event, interpolatedDescription, value, onOk, chainedChild, readOnly = false,
}) {
  const isLegendary = event.rarete === 'legendaire'
  const positive = event.nature === 'positif'

  const cardStyle = isLegendary
    ? { background: '#141414', border: '2px solid #FF3B30', borderRadius: 12 }
    : { background: '#141414', borderTop: `4px solid ${event.couleur}`, border: `1px solid #2A2A2A`, borderTopWidth: 4, borderTopColor: event.couleur, borderRadius: 10 }

  return (
    <div className="flex flex-col gap-3 p-4" style={cardStyle}>
      <div className="flex items-center justify-between gap-2">
        <span className="font-bold uppercase tracking-wider" style={{ fontSize: 10, color: event.couleur }}>
          {FAMILY_LABELS[event.famille] || event.famille}
        </span>
        <span
          className="rounded px-2 py-0.5 font-bold uppercase"
          style={{ fontSize: 9, background: '#2A2A2A', color: '#E8FF00' }}
        >
          {RARITY_LABELS[event.rarete]}
        </span>
      </div>

      <div className="flex items-start gap-3">
        <span style={{ fontSize: 28, lineHeight: 1 }}>{event.icone}</span>
        <div className="flex-1 flex flex-col gap-1">
          <h3
            className={`font-bold uppercase tracking-wide text-primary leading-tight ${isLegendary ? 'text-2xl' : 'text-base'}`}
          >
            {event.titre}
          </h3>
          <p className="text-secondary leading-snug" style={{ fontSize: 13 }}>
            {interpolatedDescription}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between pt-1" style={{ borderTop: '1px solid #2A2A2A' }}>
        <span className="text-secondary uppercase tracking-wider font-bold" style={{ fontSize: 10 }}>
          Impact
        </span>
        <ImpactBadge value={value} type={event.impact.type} positive={positive} />
      </div>

      {chainedChild && (
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2 pt-2">
            <span className="flex-1" style={{ borderTop: '1px dashed #555' }} />
            <span className="font-bold uppercase tracking-wider" style={{ fontSize: 10, color: '#888' }}>
              ── EN CONSÉQUENCE... ──
            </span>
            <span className="flex-1" style={{ borderTop: '1px dashed #555' }} />
          </div>
          {chainedChild}
        </div>
      )}

      {!readOnly && onOk && (
        <button
          onClick={onOk}
          className="w-full py-3 rounded-lg font-bold uppercase tracking-wider text-sm mt-1"
          style={{
            background: isLegendary ? '#FF3B30' : '#E8FF00',
            color: isLegendary ? '#fff' : '#000',
          }}
        >
          {isLegendary ? 'FAIRE FACE' : 'OK'}
        </button>
      )}
    </div>
  )
}
