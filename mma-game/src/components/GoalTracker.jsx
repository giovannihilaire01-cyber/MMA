export default function GoalTracker({ state }) {
  const { promotion, totalEvents, fighters } = state

  // Calculate milestones
  const financialMilestones = [
    { value: 100000, label: '$100k', reward: 'Start' },
    { value: 250000, label: '$250k', reward: 'Great Manager' },
    { value: 500000, label: '$500k', reward: 'Regional Champion' },
    { value: 1000000, label: '$1M', reward: 'Living Legend' },
  ]

  const eventMilestones = [
    { value: 5, label: '5', reward: 'Entrepreneur' },
    { value: 15, label: '15', reward: 'Great Manager' },
    { value: 30, label: '30', reward: 'Regional' },
    { value: 50, label: '50', reward: 'National' },
  ]

  const sportingMilestones = [
    { value: 10, label: '10W', reward: 'Champion Maker' },
    { value: 50, label: '50W', reward: 'Manager' },
    { value: 100, label: '100W', reward: 'Master' },
    { value: 200, label: '200W', reward: 'Legend' },
  ]

  // Calculate total wins
  const totalWins = fighters.reduce((sum, f) => sum + (f.bilan?.v || 0), 0)

  // Get next milestone for each axis
  function getNextMilestone(current, milestones) {
    for (const milestone of milestones) {
      if (current < milestone.value) {
        return milestone
      }
    }
    return milestones[milestones.length - 1]
  }

  const nextFinancial = getNextMilestone(promotion.budget, financialMilestones)
  const nextEvents = getNextMilestone(totalEvents, eventMilestones)
  const nextSporting = getNextMilestone(totalWins, sportingMilestones)

  // Calculate progress percentages
  const financialProgress = Math.min(100, (promotion.budget / nextFinancial.value) * 100)
  const eventsProgress = Math.min(100, (totalEvents / nextEvents.value) * 100)
  const sportingProgress = Math.min(100, (totalWins / nextSporting.value) * 100)

  function ProgressBar({ current, next, label, value, progress }) {
    return (
      <div className="flex flex-col gap-1.5 mb-3">
        <div className="flex items-center justify-between">
          <span className="font-bold uppercase tracking-wide text-primary" style={{ fontSize: 11 }}>
            {label}
          </span>
          <span className="text-secondary font-mono" style={{ fontSize: 10 }}>
            {value} / {next.label}
          </span>
        </div>
        <div className="w-full h-2 rounded-full bg-gray-800" style={{ background: '#2A2A2A' }}>
          <div
            className="h-2 rounded-full transition-all duration-300"
            style={{
              width: `${progress}%`,
              background: progress === 100 ? '#00FF00' : '#E8FF00',
            }}
          />
        </div>
        <span className="text-secondary text-xs italic">
          Récompense: {next.reward}
        </span>
      </div>
    )
  }

  return (
    <div
      className="rounded-lg p-4 mb-4"
      style={{
        background: '#0A0A0A',
        border: '1px solid #2A2A2A',
      }}
    >
      <h3
        className="font-bold uppercase tracking-wider mb-3"
        style={{ fontSize: 12, color: '#E8FF00' }}
      >
        📊 Progression
      </h3>

      <ProgressBar
        current={promotion.budget}
        next={nextFinancial}
        label="💰 Finances"
        value={`$${(promotion.budget / 1000).toFixed(0)}k`}
        progress={financialProgress}
      />

      <ProgressBar
        current={totalEvents}
        next={nextEvents}
        label="🎪 Événements"
        value={totalEvents}
        progress={eventsProgress}
      />

      <ProgressBar
        current={totalWins}
        next={nextSporting}
        label="🏆 Victoires"
        value={totalWins}
        progress={sportingProgress}
      />
    </div>
  )
}
