import { useState } from 'react'
import ContextualEventCard from '../components/ContextualEventCard'
import { RARITY_LABELS, FAMILY_LABELS } from '../data/eventsCatalog'

function impactLine(entry) {
  const { impactSummary, value, nature } = entry
  const sign = nature === 'positif' ? '+' : '−'
  const color = nature === 'positif' ? '#34C759' : '#FF3B30'
  if (impactSummary?.type === 'budget' || impactSummary?.type === 'combo') {
    return (
      <span className="font-mono" style={{ color, fontSize: 11 }}>
        {sign} ${Math.abs(value).toLocaleString('en-US')}
      </span>
    )
  }
  if (impactSummary?.type === 'stats') {
    return (
      <span className="font-mono" style={{ color, fontSize: 11 }}>
        {sign} {Math.abs(value)} pts · {impactSummary.fighterName}
      </span>
    )
  }
  if (impactSummary?.type === 'roster') {
    return (
      <span className="font-mono" style={{ color, fontSize: 11 }}>
        {impactSummary.delta}
      </span>
    )
  }
  return null
}

function HistoryEntry({ entry, onClick }) {
  return (
    <div
      onClick={onClick}
      className="rounded-lg p-3 flex flex-col gap-1 cursor-pointer active:opacity-80"
      style={{
        background: '#141414',
        borderLeft: `3px solid ${entry.couleur}`,
        border: '1px solid #2A2A2A',
        borderLeftWidth: 3,
        borderLeftColor: entry.couleur,
      }}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="font-bold uppercase tracking-wider" style={{ fontSize: 9, color: entry.couleur }}>
          {FAMILY_LABELS[entry.famille] || entry.famille}
        </span>
        <span
          className="rounded px-1.5 py-0.5 font-bold uppercase"
          style={{ fontSize: 8, background: '#2A2A2A', color: '#E8FF00' }}
        >
          {RARITY_LABELS[entry.rarete]}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <span style={{ fontSize: 18 }}>{entry.icone}</span>
        <span className="font-bold uppercase tracking-wide text-primary leading-tight text-sm flex-1">
          {entry.titre}
        </span>
      </div>
      {impactLine(entry)}
    </div>
  )
}

function DetailModal({ entry, onClose }) {
  if (!entry) return null
  // Build a minimal "event" shape for the card
  const event = {
    id: entry.eventId,
    titre: entry.titre,
    famille: entry.famille,
    rarete: entry.rarete,
    nature: entry.nature,
    icone: entry.icone,
    couleur: entry.couleur,
    impact: { type: entry.impactSummary?.type || 'budget' },
  }
  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.85)' }}
      onClick={onClose}
    >
      <div className="w-full max-w-sm" onClick={e => e.stopPropagation()}>
        <div className="flex justify-end mb-2">
          <button onClick={onClose} className="text-primary text-xl leading-none">×</button>
        </div>
        <ContextualEventCard
          event={event}
          interpolatedDescription={entry.description}
          value={entry.value}
          readOnly
        />
      </div>
    </div>
  )
}

export default function History({ eventLog = [] }) {
  const [selected, setSelected] = useState(null)

  return (
    <div className="flex flex-col" style={{ minHeight: 'calc(100vh - 112px)' }}>
      <div className="px-4 pt-4 pb-4 flex flex-col gap-3">
        <h2 className="font-bold uppercase tracking-wider text-primary text-sm">
          Historique · {eventLog.length} événement{eventLog.length > 1 ? 's' : ''}
        </h2>

        {eventLog.length === 0 ? (
          <div
            className="rounded-lg p-6 text-center text-secondary"
            style={{ background: '#141414', border: '1px dashed #2A2A2A', fontSize: 12 }}
          >
            Aucun événement contextuel pour l'instant.
          </div>
        ) : (
          eventLog.map(entry => (
            <HistoryEntry key={entry.id} entry={entry} onClick={() => setSelected(entry)} />
          ))
        )}
      </div>

      {selected && <DetailModal entry={selected} onClose={() => setSelected(null)} />}
    </div>
  )
}
