export default function Header({ nom, budget, flash }) {
  const isCritical = budget < 20000

  function fmt(n) {
    return '$' + Math.abs(n).toLocaleString('en-US')
  }

  const flashClass = flash === 'green' ? 'flash-green' : flash === 'red' ? 'flash-red' : ''

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 border-b border-border bg-surface"
      style={{ height: 56 }}
    >
      <span className="font-bold uppercase tracking-wider text-sm truncate max-w-[55%]">
        {nom}
      </span>
      <span
        key={flash || 'idle'}
        className={`font-mono font-bold text-sm ${flashClass}`}
        style={{ color: isCritical ? '#FF3B30' : '#E8FF00' }}
      >
        {budget < 0 ? '-' : ''}{fmt(budget)}
      </span>
    </header>
  )
}
