import { useState, useEffect, useCallback } from 'react'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { generateFighters } from './utils/generateFighters'
import { simulateEvent } from './utils/simulateFight'
import { saveGame, loadGame, clearGame } from './utils/storage'
import {
  pickContextualEvent, applyImpact, tickActiveEffects, interpolateDescription, planForeshadowing,
} from './utils/eventsEngine'
import { EVENTS_CATALOG } from './data/eventsCatalog'
import Header from './components/Header'
import BottomNav from './components/BottomNav'
import ForeshadowingBar from './components/ForeshadowingBar'
import Onboarding from './screens/Onboarding'
import Roster from './screens/Roster'
import Matchmaking from './screens/Matchmaking'
import Results from './screens/Results'
import GameOver from './screens/GameOver'
import History from './screens/History'

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
    // Contextual events feature
    nbEvenementsJoues: 0,
    eventLog: [],
    eventCooldowns: {},
    activeEffects: [],
    pendingWarnings: [],
    currentContextualEvent: null,
  }
}

function migrateState(saved) {
  const defaults = initState()
  return {
    ...defaults,
    ...saved,
    promotion: { ...defaults.promotion, ...(saved.promotion || {}) },
    eventLog: saved.eventLog || [],
    eventCooldowns: saved.eventCooldowns || {},
    activeEffects: saved.activeEffects || [],
    pendingWarnings: saved.pendingWarnings || [],
    currentContextualEvent: saved.currentContextualEvent || null,
    nbEvenementsJoues: saved.nbEvenementsJoues || 0,
  }
}

export default function App() {
  const [screen, setScreen] = useState('onboarding')
  const [activeTab, setActiveTab] = useState('roster')
  const [state, setState] = useState(initState)
  const [budgetFlash, setBudgetFlash] = useState(null)

  useEffect(() => {
    const saved = loadGame()
    if (saved) {
      setState(migrateState(saved.gameState))
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
    const budgetAfterFight = state.promotion.budget + net
    const newTotalEvents = state.totalEvents + 1
    const newTotalFights = state.totalFights + n
    const nbEvenementsJoues = (state.nbEvenementsJoues || 0) + 1

    // Tick active persistent effects before picking a new contextual event
    const ticked = tickActiveEffects({
      activeEffects: state.activeEffects || [],
      fighters: updatedRoster,
      budget: budgetAfterFight,
    })

    // Pick a contextual event (60% chance), but don't apply it yet
    const picked = pickContextualEvent({
      catalog: EVENTS_CATALOG,
      state: {
        ...state,
        promotion: { ...state.promotion, budget: ticked.budget },
        fighters: ticked.fighters,
        nbEvenementsJoues,
        activeEffects: ticked.activeEffects,
      },
    })

    // Cooldown bookkeeping + foreshadowing
    let newCooldowns = state.eventCooldowns || {}
    let pendingWarnings = state.pendingWarnings || []
    if (picked) {
      newCooldowns = { ...newCooldowns, [picked.event.id]: nbEvenementsJoues + picked.event.cooldown }
      // Emit foreshadowing when a rare/legendary is queued
      if (picked.event.rarete === 'rare' || picked.event.rarete === 'legendaire') {
        pendingWarnings = planForeshadowing({ pendingWarnings }, () => 0)
      } else {
        pendingWarnings = planForeshadowing({ pendingWarnings })
      }
    }

    const currentContextualEvent = picked
      ? { event: picked.event, value: picked.value, targetId: picked.target?.id || null, interpolated: picked.interpolated }
      : null

    const newState = {
      ...state,
      promotion: { ...state.promotion, budget: ticked.budget },
      fighters: ticked.fighters,
      activeEffects: ticked.activeEffects,
      currentEvent: [],
      lastResults: { results, financials: { revenue, costs, net, newBudget: ticked.budget, n } },
      totalEvents: newTotalEvents,
      totalFights: newTotalFights,
      nbEvenementsJoues,
      eventCooldowns: newCooldowns,
      pendingWarnings,
      currentContextualEvent,
    }

    setState(newState)
    setActiveTab('results')

    if (ticked.budget <= 0 && !currentContextualEvent) {
      setScreen('results')
      save(newState, 'gameover')
      setTimeout(() => setScreen('gameover'), 2500)
    } else {
      setScreen('results')
      save(newState, 'results')
    }
  }

  function handleAcknowledgeEvent() {
    setState(prev => {
      const ctx = prev.currentContextualEvent
      if (!ctx) return prev

      const target = ctx.targetId ? prev.fighters.find(f => f.id === ctx.targetId) : null
      const budgetBefore = prev.promotion.budget
      const { fighters, budget, summary } = applyImpact(
        { fighters: prev.fighters, budget: budgetBefore },
        ctx.event, ctx.value, target,
      )

      // If event spawns a persistent effect, register it (tied to target if fighter-related)
      let activeEffects = prev.activeEffects || []
      if (ctx.event.effet_persistant) {
        const fighterId = target?.id || null
        // For sponsor, attach to best-bilan fighter
        activeEffects = [
          ...activeEffects,
          {
            id: `eff_${ctx.event.id}_${Date.now()}`,
            type: ctx.event.effet_persistant.type,
            remainingEvents: ctx.event.effet_persistant.duree,
            fighterId,
            eventTitle: ctx.event.titre,
          },
        ]
      }

      // Log entry
      const logEntry = {
        id: `log_${Date.now()}`,
        eventId: ctx.event.id,
        titre: ctx.event.titre,
        famille: ctx.event.famille,
        rarete: ctx.event.rarete,
        couleur: ctx.event.couleur,
        icone: ctx.event.icone,
        description: ctx.interpolated,
        impactSummary: summary,
        nature: ctx.event.nature,
        value: ctx.value,
        at: Date.now(),
      }

      // Budget flash: compare budget delta sign
      const delta = budget - budgetBefore
      if (delta !== 0) {
        setBudgetFlash(delta > 0 ? 'green' : 'red')
        setTimeout(() => setBudgetFlash(null), 320)
      }

      // Chain: if the event has a chain, load that as the next contextual event
      let nextContextual = null
      if (ctx.event.chain) {
        const chainEv = EVENTS_CATALOG.find(e => e.id === ctx.event.chain)
        if (chainEv) {
          // Quick target resolution + interpolation (simple, no rng scaling)
          const chainTarget = chainEv.impact.cible && chainEv.impact.cible !== 'random'
            ? fighters.reduce((a, b) => (a && a.frappe >= (b?.frappe || 0) ? a : b), fighters[0])
            : fighters[Math.floor(Math.random() * Math.max(1, fighters.length))]
          const chainValue = chainEv.impact.valeur_min
          const interpolated = interpolateDescription(chainEv.description, {
            promotion: prev.promotion.nom,
            fighter: chainTarget?.nom || '',
            montant: chainEv.impact.type === 'budget' || chainEv.impact.type === 'combo'
              ? `$${Math.abs(chainValue).toLocaleString('en-US')}`
              : `${chainValue > 0 ? '+' : ''}${chainValue}`,
          })
          nextContextual = {
            event: chainEv,
            value: chainValue,
            targetId: chainTarget?.id || null,
            interpolated,
          }
        }
      }

      const newState = {
        ...prev,
        promotion: { ...prev.promotion, budget },
        fighters,
        activeEffects,
        eventLog: [logEntry, ...(prev.eventLog || [])],
        currentContextualEvent: nextContextual,
      }

      // Persist + check gameover
      if (budget <= 0 && !nextContextual) {
        save(newState, 'gameover')
        setTimeout(() => setScreen('gameover'), 400)
      } else {
        save(newState, 'results')
      }
      return newState
    })
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
    else if (tab === 'history') setScreen('history')
  }

  function dismissWarning(id) {
    setState(prev => ({ ...prev, pendingWarnings: (prev.pendingWarnings || []).filter(w => w.id !== id) }))
  }

  const showChrome = screen !== 'onboarding' && screen !== 'gameover'
  const hasResults = !!state.lastResults

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex flex-col bg-bg text-primary" style={{ minHeight: '100dvh', minHeight: '100vh' }}>
        {showChrome && (
          <Header nom={state.promotion.nom} budget={state.promotion.budget} flash={budgetFlash} />
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
              activeEffects={state.activeEffects}
              onRecruit={handleRecruit}
              onGoMatchmaking={() => { setScreen('matchmaking'); setActiveTab('matchmaking') }}
            />
          )}
          {screen === 'matchmaking' && (
            <Matchmaking
              fighters={state.fighters}
              currentEvent={state.currentEvent}
              activeEffects={state.activeEffects}
              onUpdateEvent={updateCurrentEvent}
              onSimulate={handleSimulate}
            />
          )}
          {screen === 'results' && state.lastResults && (
            <Results
              results={state.lastResults.results}
              financials={state.lastResults.financials}
              fighters={state.fighters}
              contextualEvent={state.currentContextualEvent}
              onAcknowledgeEvent={handleAcknowledgeEvent}
              onNewEvent={handleNewEvent}
            />
          )}
          {screen === 'history' && (
            <History eventLog={state.eventLog || []} />
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
          <ForeshadowingBar
            warnings={state.pendingWarnings || []}
            onDismiss={dismissWarning}
          />
        )}

        {showChrome && (
          <BottomNav active={activeTab} hasResults={hasResults} onChange={handleTabChange} />
        )}
      </div>
    </DndProvider>
  )
}
