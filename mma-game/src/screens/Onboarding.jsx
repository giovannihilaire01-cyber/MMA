import { useState } from 'react'

export default function Onboarding({ onStart }) {
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)

  function handleSubmit(e) {
    e.preventDefault()
    const trimmed = name.trim()
    if (!trimmed) return
    setLoading(true)
    setTimeout(() => onStart(trimmed), 100)
  }

  return (
    <div
      className="flex flex-col items-center justify-center px-6 text-center"
      style={{ minHeight: '100dvh', minHeight: '100vh', background: '#0A0A0A' }}
    >
      <div className="w-full max-w-sm flex flex-col gap-8">
        {/* Logo / Title */}
        <div className="flex flex-col gap-2">
          <div
            className="font-bold uppercase tracking-widest"
            style={{ color: '#E8FF00', fontSize: 11 }}
          >
            ⬡ SIMULATION
          </div>
          <h1
            className="font-bold uppercase tracking-wider leading-none"
            style={{ fontSize: 28, color: '#F5F5F5' }}
          >
            MMA<br />PROMOTION<br />MANAGER
          </h1>
          <p className="text-secondary text-sm">
            Dirige ta propre organisation de combat.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2 text-left">
            <label
              className="uppercase tracking-wider font-bold text-secondary"
              style={{ fontSize: 11 }}
            >
              Nom de ta promotion
            </label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Ex. APEX FC"
              maxLength={30}
              autoFocus
              className="w-full px-4 py-3 rounded-lg text-primary font-bold uppercase tracking-wider outline-none text-sm"
              style={{
                background: '#141414',
                border: '1px solid #2A2A2A',
                caretColor: '#E8FF00',
              }}
              onFocus={e => (e.target.style.borderColor = '#E8FF00')}
              onBlur={e => (e.target.style.borderColor = '#2A2A2A')}
            />
          </div>

          <button
            type="submit"
            disabled={!name.trim() || loading}
            className="w-full py-4 rounded-lg font-bold uppercase tracking-wider text-sm transition-opacity"
            style={{
              background: name.trim() && !loading ? '#E8FF00' : '#2A2A2A',
              color: name.trim() && !loading ? '#000' : '#555',
              cursor: name.trim() && !loading ? 'pointer' : 'default',
            }}
          >
            {loading ? 'GÉNÉRATION...' : 'LANCER LA CARRIÈRE'}
          </button>
        </form>

        <p className="text-secondary" style={{ fontSize: 10 }}>
          16 combattants générés automatiquement · Budget initial $100,000
        </p>
      </div>
    </div>
  )
}
