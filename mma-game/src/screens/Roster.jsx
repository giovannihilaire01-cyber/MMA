import { useState } from 'react'
import FighterCard from '../components/FighterCard'
import GoalTracker from '../components/GoalTracker'
import { generateRecruits } from '../utils/generateFighters'

const SORT_OPTIONS = [
  { id: 'frappe', label: 'Frappe' },
  { id: 'lutte', label: 'Lutte' },
  { id: 'sol', label: 'Sol' },
  { id: 'bilan', label: 'Bilan' },
]

function StatBar({ label, value, color }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-secondary uppercase tracking-wide font-bold w-14" style={{ fontSize: 10 }}>
        {label}
      </span>
      <div className="flex-1 h-1.5 rounded-full" style={{ background: '#2A2A2A' }}>
        <div className="h-1.5 rounded-full" style={{ width: `${value}%`, background: color }} />
      </div>
      <span className="font-mono text-primary w-6 text-right" style={{ fontSize: 11 }}>{value}</span>
    </div>
  )
}

function FighterModal({ fighter, onClose }) {
  if (!fighter) return null
  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.85)' }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-xl p-5 flex flex-col gap-4"
        style={{ background: '#141414', border: '1px solid #2A2A2A' }}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-start justify-between">
          <h2 className="font-bold uppercase tracking-wider text-primary text-base">
            {fighter.nom}
          </h2>
          <button onClick={onClose} className="text-secondary text-xl leading-none">×</button>
        </div>
        <div className="flex flex-col gap-2">
          <StatBar label="Frappe" value={fighter.frappe} color="#E8FF00" />
          <StatBar label="Lutte" value={fighter.lutte} color="#60A5FA" />
          <StatBar label="Sol" value={fighter.sol} color="#FB923C" />
        </div>
        <div className="flex gap-4 pt-1">
          <div className="text-center flex-1 rounded-lg py-2" style={{ background: '#0A0A0A' }}>
            <div className="font-mono font-bold text-lg" style={{ color: '#34C759' }}>
              {fighter.bilan.v}
            </div>
            <div className="text-secondary uppercase tracking-wide" style={{ fontSize: 10 }}>
              Victoires
            </div>
          </div>
          <div className="text-center flex-1 rounded-lg py-2" style={{ background: '#0A0A0A' }}>
            <div className="font-mono font-bold text-lg" style={{ color: '#FF3B30' }}>
              {fighter.bilan.d}
            </div>
            <div className="text-secondary uppercase tracking-wide" style={{ fontSize: 10 }}>
              Défaites
            </div>
          </div>
        </div>
        <button
          onClick={onClose}
          className="w-full py-3 rounded-lg font-bold uppercase tracking-wider text-sm"
          style={{ background: '#2A2A2A', color: '#F5F5F5' }}
        >
          FERMER
        </button>
      </div>
    </div>
  )
}

function RecruitModal({ recruits, onSelect, onClose, budget }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.85)' }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-xl p-5 flex flex-col gap-4"
        style={{ background: '#141414', border: '1px solid #2A2A2A' }}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-start justify-between">
          <div>
            <h2 className="font-bold uppercase tracking-wider text-primary text-base">Recruter</h2>
            <p className="text-secondary" style={{ fontSize: 11 }}>Choisir 1 combattant · Coût $15,000</p>
          </div>
          <button onClick={onClose} className="text-secondary text-xl leading-none">×</button>
        </div>

        {budget < 15000 && (
          <div
            className="rounded-lg px-3 py-2 text-sm font-bold text-center"
            style={{ background: 'rgba(255,59,48,0.15)', color: '#FF3B30' }}
          >
            Budget insuffisant ($15,000 requis)
          </div>
        )}

        <div className="flex flex-col gap-3">
          {recruits.map(r => (
            <div
              key={r.id}
              className="rounded-lg p-3 flex flex-col gap-2"
              style={{ background: '#0A0A0A', border: '1px solid #2A2A2A' }}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold uppercase tracking-wide text-sm text-primary">{r.nom}</span>
                <button
                  onClick={() => budget >= 15000 && onSelect(r)}
                  disabled={budget < 15000}
                  className="rounded px-3 py-1 font-bold uppercase tracking-wide text-xs transition-opacity"
                  style={{
                    background: budget >= 15000 ? '#E8FF00' : '#2A2A2A',
                    color: budget >= 15000 ? '#000' : '#555',
                    cursor: budget >= 15000 ? 'pointer' : 'default',
                  }}
                >
                  RECRUTER
                </button>
              </div>
              <div className="flex flex-col gap-1">
                <StatBar label="Frappe" value={r.frappe} color="#E8FF00" />
                <StatBar label="Lutte" value={r.lutte} color="#60A5FA" />
                <StatBar label="Sol" value={r.sol} color="#FB923C" />
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={onClose}
          className="w-full py-3 rounded-lg font-bold uppercase tracking-wider text-sm"
          style={{ background: '#2A2A2A', color: '#F5F5F5' }}
        >
          ANNULER
        </button>
      </div>
    </div>
  )
}

export default function Roster({ fighters, currentEvent, budget, activeEffects = [], totalEvents = 0, onRecruit, onGoMatchmaking }) {
  const effectsByFighter = activeEffects.reduce((acc, e) => {
    if (e.fighterId) (acc[e.fighterId] = acc[e.fighterId] || []).push(e)
    return acc
  }, {})
  const [sortBy, setSortBy] = useState('frappe')
  const [selectedFighter, setSelectedFighter] = useState(null)
  const [showRecruit, setShowRecruit] = useState(false)
  const [recruits, setRecruits] = useState([])

  const selectedIds = new Set(
    currentEvent.flatMap(m => [m.fighter1Id, m.fighter2Id].filter(Boolean))
  )

  const sorted = [...fighters].sort((a, b) => {
    if (sortBy === 'bilan') return (b.bilan.v - b.bilan.d) - (a.bilan.v - a.bilan.d)
    return b[sortBy] - a[sortBy]
  })

  function openRecruit() {
    const names = fighters.map(f => f.nom)
    setRecruits(generateRecruits(names))
    setShowRecruit(true)
  }

  function handleSelect(recruit) {
    onRecruit(recruit)
    setShowRecruit(false)
  }

  const eventCount = currentEvent.filter(m => m.fighter1Id && m.fighter2Id).length

  return (
    <div className="flex flex-col h-full" style={{ minHeight: 'calc(100vh - 112px)' }}>
      {/* Sort bar */}
      <div className="px-4 pt-4 pb-2 flex gap-2">
        {SORT_OPTIONS.map(o => (
          <button
            key={o.id}
            onClick={() => setSortBy(o.id)}
            className="px-3 py-1.5 rounded-lg font-bold uppercase tracking-wide transition-colors"
            style={{
              fontSize: 10,
              background: sortBy === o.id ? '#E8FF00' : '#141414',
              color: sortBy === o.id ? '#000' : '#888',
              border: `1px solid ${sortBy === o.id ? '#E8FF00' : '#2A2A2A'}`,
            }}
          >
            {o.label}
          </button>
        ))}
      </div>

      {/* Goal Tracker */}
      <div className="px-4 py-2">
        <GoalTracker
          state={{
            promotion: { budget },
            totalEvents,
            fighters,
          }}
        />
      </div>

      {/* Event CTA if event in progress */}
      {eventCount > 0 && (
        <div className="px-4 pb-2">
          <button
            onClick={onGoMatchmaking}
            className="w-full py-2.5 rounded-lg font-bold uppercase tracking-wider text-sm"
            style={{ background: 'rgba(232,255,0,0.1)', color: '#E8FF00', border: '1px solid #E8FF00' }}
          >
            ⚡ CONTINUER L'ÉVÉNEMENT ({eventCount} combat{eventCount > 1 ? 's' : ''})
          </button>
        </div>
      )}

      {/* Fighter grid */}
      <div className="flex-1 overflow-y-auto px-4 pb-4">
        <div className="grid grid-cols-2 gap-3">
          {sorted.map(f => (
            <FighterCard
              key={f.id}
              fighter={f}
              inEvent={selectedIds.has(f.id)}
              effects={effectsByFighter[f.id] || []}
              onClick={() => setSelectedFighter(f)}
            />
          ))}
        </div>
      </div>

      {/* Recruit button */}
      <div className="px-4 py-3" style={{ borderTop: '1px solid #2A2A2A', background: '#0A0A0A' }}>
        <button
          onClick={openRecruit}
          className="w-full py-3.5 rounded-lg font-bold uppercase tracking-wider text-sm"
          style={{ background: '#141414', color: '#E8FF00', border: '1px solid #2A2A2A' }}
        >
          + RECRUTER
        </button>
      </div>

      {selectedFighter && (
        <FighterModal fighter={selectedFighter} onClose={() => setSelectedFighter(null)} />
      )}
      {showRecruit && (
        <RecruitModal
          recruits={recruits}
          budget={budget}
          onSelect={handleSelect}
          onClose={() => setShowRecruit(false)}
        />
      )}
    </div>
  )
}
