import { useState, useEffect, useCallback } from 'react'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { generateFighters } from './utils/generateFighters'
import { simulateEvent } from './utils/simulateFight'
import { saveGame, loadGame, clearGame } from './utils/storage'
import Header from './components/Header'
import BottomNav from './components/BottomNav'
import Onboarding from './screens/Onboarding'
import Roster from './screens/Roster'
import Matchmaking from './screens/Matchmaking'
import Results from './screens/Results'
import GameOver from './screens/GameOver'

const REVENUE_PER_FIGHT = 8000
const COST_PER_FIGHT = 3000
const FIXED_COST = 5000

function initState() {
  return {
    promotion: { nom: '', budget: 100000 },
    fighters: [],
    currentEvent: [],
    lastResults: null,
    totalEvents: 0,
    totalFights: 0,
  }
}

export default function App() {
  const [screen, setScreen] = useState('onboarding')
  const [activeTab, setActiveTab] = useState('roster')
  const [state, setState] = useState(initState)

  useEffect(() => {
    const saved = loadGame()
    if (saved) {
      setState(saved.gameState)
      const s = saved.screen
      if (s && s !== 'onboarding') {
        setScreen(s === 'gameover' ? 'gameover' : 'roster')
        setActiveTab('roster')
      }
    }
  }, [])

  const save = useCallback((newState, newScreen) => {
    saveGame({ gameState: newState, screen: newScreen })
  }, [])

  function handleStart(promotionName) {
    const fighters = generateFighters(16)
    const newState = {
      ...initState(),
      promotion: { nom: promotionName, budget: 100000 },
      fighters,
    }
    setState(newState)
    setScreen('roster')
    setActiveTab('roster')
    save(newState, 'roster')
  }

  function handleRecruit(recruit) {
    setState(prev => {
      const newBudget = prev.promotion.budget - 15000
      const newState = {
        ...prev,
        promotion: { ...prev.promotion, budget: newBudget },
        fighters: [...prev.fighters, recruit],
      }
      if (newBudget <= 0) {
        save(newState, 'gameover')
        setScreen('gameover')
      } else {
        save(newState, 'roster')
      }
      return newState
    })
  }

  function updateCurrentEvent(newEvent) {
    setState(prev => ({ ...prev, currentEvent: newEvent }))
  }

  function handleSimulate() {
    const completed = state.currentEvent.filter(m => m.fighter1Id && m.fighter2Id)
    if (completed.length === 0) return

    const { results, updatedRoster } = simulateEvent(completed, state.fighters)

    const n = completed.length
    const revenue = n * REVENUE_PER_FIGHT
    const costs = n * COST_PER_FIGHT + FIXED_COST
    const net = revenue - costs
    const newBudget = state.promotion.budget + net
    const newTotalEvents = state.totalEvents + 1
    const newTotalFights = state.totalFights + n

    const newState = {
      ...state,
      promotion: { ...state.promotion, budget: newBudget },
      fighters: updatedRoster,
      currentEvent: [],
      lastResults: { results, financials: { revenue, costs, net, newBudget, n } },
      totalEvents: newTotalEvents,
      totalFights: newTotalFights,
    }

    setState(newState)
    setActiveTab('results')

    if (newBudget <= 0) {
      setScreen('results')
      save(newState, 'gameover')
      setTimeout(() => setScreen('gameover'), 2500)
    } else {
      setScreen('results')
      save(newState, 'results')
    }
  }

  function handleNewEvent() {
    setState(prev => ({ ...prev, currentEvent: [] }))
    setScreen('matchmaking')
    setActiveTab('matchmaking')
  }

  function handleNewGame() {
    clearGame()
    setState(initState())
    setScreen('onboarding')
    setActiveTab('roster')
  }

  function handleTabChange(tab) {
    setActiveTab(tab)
    if (tab === 'roster') setScreen('roster')
    else if (tab === 'matchmaking') setScreen('matchmaking')
    else if (tab === 'results') setScreen('results')
  }

  const showChrome = screen !== 'onboarding' && screen !== 'gameover'
  const hasResults = !!state.lastResults

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex flex-col bg-bg text-primary" style={{ minHeight: '100dvh', minHeight: '100vh' }}>
        {showChrome && (
          <Header nom={state.promotion.nom} budget={state.promotion.budget} />
        )}

        <main
          className="flex-1 overflow-y-auto"
          style={{
            marginTop: showChrome ? 56 : 0,
            marginBottom: showChrome ? 56 : 0,
            WebkitOverflowScrolling: 'touch',
          }}
        >
          {screen === 'onboarding' && <Onboarding onStart={handleStart} />}
          {screen === 'roster' && (
            <Roster
              fighters={state.fighters}
              currentEvent={state.currentEvent}
              budget={state.promotion.budget}
              onRecruit={handleRecruit}
              onGoMatchmaking={() => { setScreen('matchmaking'); setActiveTab('matchmaking') }}
            />
          )}
          {screen === 'matchmaking' && (
            <Matchmaking
              fighters={state.fighters}
              currentEvent={state.currentEvent}
              onUpdateEvent={updateCurrentEvent}
              onSimulate={handleSimulate}
            />
          )}
          {screen === 'results' && state.lastResults && (
            <Results
              results={state.lastResults.results}
              financials={state.lastResults.financials}
              fighters={state.fighters}
              onNewEvent={handleNewEvent}
            />
          )}
          {screen === 'gameover' && (
            <GameOver
              totalEvents={state.totalEvents}
              totalFights={state.totalFights}
              fighters={state.fighters}
              onNewGame={handleNewGame}
            />
          )}
        </main>

        {showChrome && (
          <BottomNav active={activeTab} hasResults={hasResults} onChange={handleTabChange} />
        )}
      </div>
    </DndProvider>
  )
}
