import { useState, useRef } from 'react'
import { useDrag, useDrop } from 'react-dnd'

const DND_TYPE = 'FIGHTER'

// Draggable fighter card in the pool
function PoolCard({ fighter, suspended = false }) {
  const [{ isDragging }, drag] = useDrag({
    type: DND_TYPE,
    item: { id: fighter.id },
    canDrag: () => !suspended,
    collect: monitor => ({ isDragging: monitor.isDragging() }),
  })

  return (
    <div
      ref={drag}
      className="rounded-lg p-2.5 flex flex-col gap-1 shrink-0 select-none"
      style={{
        background: '#141414',
        border: `1px solid ${suspended ? '#444' : '#2A2A2A'}`,
        minWidth: 100,
        opacity: suspended ? 0.4 : (isDragging ? 0.3 : 1),
        transition: 'opacity 0.15s',
        cursor: suspended ? 'not-allowed' : 'grab',
      }}
    >
      <span className="font-bold uppercase tracking-wide text-primary leading-tight" style={{ fontSize: 10 }}>
        {suspended ? '🚫 ' : ''}{fighter.nom}
      </span>
      <div className="flex gap-1 font-mono" style={{ fontSize: 9 }}>
        <span style={{ color: '#E8FF00' }}>{fighter.frappe}</span>
        <span className="text-secondary">/</span>
        <span style={{ color: '#60A5FA' }}>{fighter.lutte}</span>
        <span className="text-secondary">/</span>
        <span style={{ color: '#FB923C' }}>{fighter.sol}</span>
      </div>
    </div>
  )
}

// Droppable slot
function FighterSlot({ fighter, slotKey, onDrop, onRemove }) {
  const [{ isOver, canDrop }, drop] = useDrop({
    accept: DND_TYPE,
    drop: item => onDrop(slotKey, item.id),
    canDrop: () => !fighter,
    collect: monitor => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  })

  const isActive = isOver && canDrop

  if (fighter) {
    return (
      <div
        className="flex-1 rounded-lg p-2 flex flex-col gap-0.5 cursor-pointer active:opacity-70"
        style={{
          background: '#1E1E1E',
          border: '1px solid #E8FF00',
          minHeight: 52,
        }}
        onClick={() => onRemove(slotKey)}
      >
        <span className="font-bold uppercase tracking-wide text-primary leading-tight" style={{ fontSize: 10 }}>
          {fighter.nom}
        </span>
        <div className="flex gap-1 font-mono" style={{ fontSize: 9 }}>
          <span style={{ color: '#E8FF00' }}>{fighter.frappe}</span>
          <span className="text-secondary">/</span>
          <span style={{ color: '#60A5FA' }}>{fighter.lutte}</span>
          <span className="text-secondary">/</span>
          <span style={{ color: '#FB923C' }}>{fighter.sol}</span>
        </div>
        <span className="text-secondary" style={{ fontSize: 8 }}>Tap pour retirer</span>
      </div>
    )
  }

  return (
    <div
      ref={drop}
      className="flex-1 rounded-lg flex items-center justify-center"
      style={{
        border: `2px dashed ${isActive ? '#E8FF00' : '#2A2A2A'}`,
        background: isActive ? 'rgba(232,255,0,0.05)' : 'transparent',
        minHeight: 52,
        transition: 'all 0.15s',
      }}
    >
      <span
        className="uppercase tracking-wide font-bold"
        style={{ fontSize: 9, color: isActive ? '#E8FF00' : '#444' }}
      >
        DROP ICI
      </span>
    </div>
  )
}

// One matchup row
function MatchupRow({ index, matchup, fighters, onDrop, onRemove, onDelete, isMain }) {
  const f1 = fighters.find(f => f.id === matchup.fighter1Id)
  const f2 = fighters.find(f => f.id === matchup.fighter2Id)

  return (
    <div
      className="rounded-lg p-3 flex flex-col gap-2"
      style={{ background: '#141414', border: '1px solid #2A2A2A' }}
    >
      <div className="flex items-center justify-between">
        <span
          className="font-bold uppercase tracking-wider"
          style={{ fontSize: 10, color: isMain ? '#E8FF00' : '#888' }}
        >
          {isMain ? 'MAIN EVENT' : `FIGHT ${index + 1}`}
        </span>
        {!isMain && (
          <button
            onClick={() => onDelete(index)}
            className="text-secondary hover:text-lose transition-colors"
            style={{ fontSize: 14 }}
          >
            ×
          </button>
        )}
      </div>
      <div className="flex items-center gap-2">
        <FighterSlot
          fighter={f1}
          slotKey={`${index}-1`}
          onDrop={onDrop}
          onRemove={onRemove}
        />
        <span className="font-bold text-secondary text-xs shrink-0">VS</span>
        <FighterSlot
          fighter={f2}
          slotKey={`${index}-2`}
          onDrop={onDrop}
          onRemove={onRemove}
        />
      </div>
    </div>
  )
}

export default function Matchmaking({ fighters, currentEvent, activeEffects = [], onUpdateEvent, onSimulate }) {
  // Ensure at least 1 slot
  const event = currentEvent.length > 0
    ? currentEvent
    : [{ fighter1Id: null, fighter2Id: null }]

  const suspendedIds = new Set(
    activeEffects.filter(e => e.type === 'suspension' && e.fighterId).map(e => e.fighterId)
  )
  const usedIds = new Set(event.flatMap(m => [m.fighter1Id, m.fighter2Id].filter(Boolean)))
  const availablePool = fighters.filter(f => !usedIds.has(f.id) && !suspendedIds.has(f.id))
  const suspendedPool = fighters.filter(f => suspendedIds.has(f.id))

  const [simulating, setSimulating] = useState(false)

  function handleDrop(slotKey, fighterId) {
    const [rowIdx, slotNum] = slotKey.split('-').map(Number)
    const updated = event.map((m, i) => {
      if (i !== rowIdx) return m
      return slotNum === 1
        ? { ...m, fighter1Id: fighterId }
        : { ...m, fighter2Id: fighterId }
    })
    onUpdateEvent(updated)
  }

  function handleRemove(slotKey) {
    const [rowIdx, slotNum] = slotKey.split('-').map(Number)
    const updated = event.map((m, i) => {
      if (i !== rowIdx) return m
      return slotNum === 1
        ? { ...m, fighter1Id: null }
        : { ...m, fighter2Id: null }
    })
    onUpdateEvent(updated)
  }

  function addFight() {
    if (event.length >= 5) return
    onUpdateEvent([...event, { fighter1Id: null, fighter2Id: null }])
  }

  function deleteFight(index) {
    const updated = event.filter((_, i) => i !== index)
    onUpdateEvent(updated.length > 0 ? updated : [{ fighter1Id: null, fighter2Id: null }])
  }

  function handleSimulate() {
    setSimulating(true)
    setTimeout(() => {
      onSimulate()
      setSimulating(false)
    }, 400)
  }

  const completedCount = event.filter(m => m.fighter1Id && m.fighter2Id).length
  const canSimulate = completedCount > 0

  return (
    <div className="flex flex-col" style={{ minHeight: 'calc(100vh - 112px)' }}>
      {/* Event slots */}
      <div className="flex-1 overflow-y-auto px-4 pt-4 flex flex-col gap-3">
        {event.map((m, i) => (
          <MatchupRow
            key={i}
            index={i}
            matchup={m}
            fighters={fighters}
            onDrop={handleDrop}
            onRemove={handleRemove}
            onDelete={deleteFight}
            isMain={i === 0}
          />
        ))}

        {event.length < 5 && (
          <button
            onClick={addFight}
            className="w-full py-3 rounded-lg font-bold uppercase tracking-wider text-sm"
            style={{
              border: '1px dashed #2A2A2A',
              color: '#555',
              background: 'transparent',
            }}
          >
            + AJOUTER UN COMBAT
          </button>
        )}

        {/* Pool label */}
        <div className="pt-2">
          <span
            className="uppercase tracking-wider font-bold text-secondary"
            style={{ fontSize: 10 }}
          >
            Combattants disponibles ({availablePool.length})
            {suspendedPool.length > 0 && (
              <span style={{ color: '#FF3B30', marginLeft: 8 }}>
                · {suspendedPool.length} indisponible{suspendedPool.length > 1 ? 's' : ''}
              </span>
            )}
          </span>
        </div>
      </div>

      {/* Pool — horizontal scroll */}
      <div
        className="px-4 py-3 flex gap-2 overflow-x-auto"
        style={{ borderTop: '1px solid #2A2A2A' }}
      >
        {availablePool.length === 0 && suspendedPool.length === 0 ? (
          <span className="text-secondary text-xs italic">Tous les combattants sont placés.</span>
        ) : (
          <>
            {availablePool.map(f => <PoolCard key={f.id} fighter={f} />)}
            {suspendedPool.map(f => <PoolCard key={f.id} fighter={f} suspended />)}
          </>
        )}
      </div>

      {/* Simulate CTA */}
      <div className="px-4 py-3" style={{ borderTop: '1px solid #2A2A2A', background: '#0A0A0A' }}>
        {completedCount > 0 && (
          <p className="text-secondary text-center mb-2" style={{ fontSize: 11 }}>
            {completedCount} combat{completedCount > 1 ? 's' : ''} · Net estimé:{' '}
            <span style={{ color: '#E8FF00' }}>
              +${((completedCount * 8000) - (completedCount * 3000) - 5000).toLocaleString('en-US')}
            </span>
          </p>
        )}
        <button
          onClick={handleSimulate}
          disabled={!canSimulate || simulating}
          className="w-full py-4 rounded-lg font-bold uppercase tracking-wider text-sm transition-all"
          style={{
            background: canSimulate && !simulating ? '#E8FF00' : '#1A1A1A',
            color: canSimulate && !simulating ? '#000' : '#444',
            cursor: canSimulate && !simulating ? 'pointer' : 'default',
            transform: simulating ? 'scale(0.98)' : 'scale(1)',
          }}
        >
          {simulating ? '⚡ SIMULATION...' : 'SIMULER L\'ÉVÉNEMENT'}
        </button>
      </div>
    </div>
  )
}
