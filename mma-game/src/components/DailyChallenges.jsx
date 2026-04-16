import { getDailyChallengesForToday, checkChallenge } from '../data/dailyChallenges'

export default function DailyChallenges({ state, lastResults }) {
  const challenges = getDailyChallengesForToday()

  const completedCount = challenges.filter(c => checkChallenge(c, state, lastResults)).length

  return (
    <div className="rounded-lg p-4 mb-4" style={{ background: '#0A0A0A', border: '1px solid #2A2A2A' }}>
      <h3 className="font-bold uppercase tracking-wider mb-3" style={{ fontSize: 12, color: '#E8FF00' }}>
        📅 Défis du Jour ({completedCount}/{challenges.length})
      </h3>

      <div className="flex flex-col gap-2">
        {challenges.map(challenge => {
          const completed = checkChallenge(challenge, state, lastResults)
          return (
            <div
              key={challenge.id}
              className="rounded-lg p-3 flex items-center gap-3"
              style={{
                background: completed ? 'rgba(52,199,89,0.15)' : '#141414',
                border: `1px solid ${completed ? '#34C759' : '#2A2A2A'}`,
                opacity: completed ? 1 : 0.7,
              }}
            >
              <span style={{ fontSize: 20 }}>{challenge.icon}</span>
              <div className="flex-1">
                <div className="font-bold text-sm text-primary">{challenge.name}</div>
                <div className="text-xs text-secondary">{challenge.description}</div>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className="font-mono font-bold text-sm" style={{ color: '#E8FF00' }}>
                  +${challenge.reward.toLocaleString()}
                </span>
                {completed && (
                  <span className="text-xs" style={{ color: '#34C759' }}>✓ Complété</span>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
