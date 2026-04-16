import { calculateFighterLevel } from '../utils/simulateFight'
import EffectIcon from './EffectIcon'

function EffectRow({ effects }) {
  if (!effects || effects.length === 0) return null
  return (
    <div className="flex gap-1 flex-wrap">
      {effects.map(e => <EffectIcon key={e.id} effect={e} />)}
    </div>
  )
}

function StatBar({ label, value, color }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-secondary uppercase tracking-wide font-bold w-12" style={{ fontSize: 10 }}>
        {label}
      </span>
      <div className="flex-1 h-1.5 rounded-full" style={{ background: '#2A2A2A' }}>
        <div
          className="h-1.5 rounded-full transition-all"
          style={{ width: `${value}%`, background: color }}
        />
      </div>
      <span className="font-mono text-primary w-6 text-right" style={{ fontSize: 11 }}>
        {value}
      </span>
    </div>
  )
}

export default function FighterCard({ fighter, inEvent = false, compact = false, onClick, effects = [] }) {
  const { nom, frappe, lutte, sol, bilan } = fighter
  const suspended = effects.some(e => e.type === 'suspension')
  const disabledStyle = suspended ? { opacity: 0.4, borderColor: '#444' } : {}

  // Calculate fighter level
  const levelInfo = calculateFighterLevel(fighter)

  if (compact) {
    return (
      <div
        onClick={onClick}
        className="rounded-lg p-2.5 flex flex-col gap-1 cursor-pointer select-none"
        style={{
          background: '#141414',
          border: `1px solid ${inEvent ? '#E8FF00' : '#2A2A2A'}`,
          minWidth: 110,
          ...disabledStyle,
        }}
      >
        <span className="font-bold uppercase tracking-wide text-primary leading-tight" style={{ fontSize: 11 }}>
          {nom}
        </span>
        <div className="flex gap-1 items-center justify-between">
          <div className="flex gap-1.5 font-mono" style={{ fontSize: 9 }}>
            <span style={{ color: '#E8FF00' }}>{frappe}</span>
            <span className="text-secondary">/</span>
            <span style={{ color: '#60A5FA' }}>{lutte}</span>
            <span className="text-secondary">/</span>
            <span style={{ color: '#FB923C' }}>{sol}</span>
          </div>
          <span style={{ fontSize: 11 }}>{levelInfo.stars}</span>
        </div>
        <EffectRow effects={effects} />
        <span className="text-secondary font-mono" style={{ fontSize: 9 }}>
          {bilan.v}V · {bilan.d}D
        </span>
      </div>
    )
  }

  return (
    <div
      onClick={onClick}
      className="rounded-lg p-3 flex flex-col gap-2 cursor-pointer active:opacity-80 transition-opacity select-none"
      style={{
        background: '#141414',
        border: `1px solid ${inEvent ? '#E8FF00' : '#2A2A2A'}`,
        ...disabledStyle,
      }}
    >
      <div className="flex items-start justify-between gap-1">
        <div className="flex flex-col gap-0.5">
          <span className="font-bold uppercase tracking-wide text-primary leading-tight text-sm">
            {nom}
          </span>
          <span style={{ fontSize: 10, color: '#888' }}>
            {levelInfo.stars} {levelInfo.title}
          </span>
        </div>
        {inEvent && (
          <span
            className="rounded px-1 font-bold uppercase shrink-0"
            style={{ fontSize: 9, background: '#E8FF00', color: '#000' }}
          >
            SÉLECT.
          </span>
        )}
      </div>
      <EffectRow effects={effects} />
      <div className="flex flex-col gap-1.5">
        <StatBar label="Frappe" value={frappe} color="#E8FF00" />
        <StatBar label="Lutte" value={lutte} color="#60A5FA" />
        <StatBar label="Sol" value={sol} color="#FB923C" />
      </div>
      <span className="text-secondary font-mono" style={{ fontSize: 11 }}>
        {bilan.v}V · {bilan.d}D
      </span>
    </div>
  )
}
