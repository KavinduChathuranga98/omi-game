import { create } from 'zustand'
import {
  GameState, GamePhase, Suit, Position, Card, PlayedCard, Declaration, GameMode,
} from '../types'
import { createDeck, dealCards } from '../engine/deck'
import { completeTrick, getActivePlayers } from '../engine/gameEngine'
import { calculateRoundResult, applyRoundToScore } from '../engine/scoring'
import { getAIMove, getAITrumpSelection } from '../engine/aiEngine'

const PLAYER_NAMES = ['You', 'West', 'Partner', 'East']

function makeBase(): GameState {
  return {
    phase: 'menu' as GamePhase,
    players: PLAYER_NAMES.map((name, i) => ({
      position: i as Position,
      name,
      hand: [],
      isHuman: i === 0,
      teamId: (i % 2 === 0 ? 0 : 1) as 0 | 1,
    })),
    currentTrick: [],
    completedTricks: [],
    trumpSuit: null,
    currentPlayer: 0 as Position,
    leadPlayer: 0 as Position,
    declaration: null,
    scores: { team0: 0, team1: 0 },
    roundScores: [],
    roundNumber: 0,
    gameMode: 'modern' as GameMode,
    dealer: 3 as Position,
    trumpSelector: 1 as Position,
    partnerSitsOut: false,
    kiyaActive: false,
    bailaActive: false,
    targetScore: 21,
  }
}

interface GameStore extends GameState {
  startGame: (mode: GameMode, targetScore: number) => void
  dealRound: () => void
  selectTrump: (suit: Suit) => void
  declareBaila: (trumpSuit: Suit) => void
  declareKiya: () => void
  passDeclaration: () => void
  playCard: (card: Card, playerPosition: Position) => void
  nextRound: () => void
  resetGame: () => void
  _advanceAI: () => void
}

export const useGameStore = create<GameStore>((set, get) => ({
  ...makeBase(),

  startGame: (mode, targetScore) => {
    const base = { ...makeBase(), phase: 'dealing' as GamePhase, gameMode: mode, targetScore }
    set(base)
    setTimeout(() => get().dealRound(), 300)
  },

  dealRound: () => {
    const state = get()
    const [h0, h1, h2, h3] = dealCards(createDeck())
    const dealer = ((state.dealer + 1) % 4) as Position
    const trumpSelector = ((dealer + 2) % 4) as Position
    const newPlayers = state.players.map((p, i) => ({
      ...p,
      hand: [h0, h1, h2, h3][i],
    }))
    const nextPhase: GamePhase = state.gameMode === 'modern' ? 'baila-opportunity' : 'trump-selection'
    set({
      players: newPlayers,
      currentTrick: [],
      completedTricks: [],
      trumpSuit: null,
      declaration: null,
      partnerSitsOut: false,
      kiyaActive: false,
      bailaActive: false,
      dealer,
      trumpSelector,
      currentPlayer: trumpSelector,
      leadPlayer: ((dealer + 1) % 4) as Position,
      roundNumber: state.roundNumber + 1,
      phase: nextPhase,
    })
    // If AI is trump selector and classic mode, auto-select
    if (state.gameMode === 'classic' && trumpSelector !== 0) {
      const aiTrump = getAITrumpSelection(newPlayers[trumpSelector].hand)
      setTimeout(() => get().selectTrump(aiTrump), 800)
    }
  },

  selectTrump: (suit: Suit) => {
    const state = get()
    if (state.gameMode === 'modern' && !state.bailaActive) {
      set({ trumpSuit: suit, phase: 'kiya-opportunity', currentPlayer: state.leadPlayer })
      return
    }
    set({ trumpSuit: suit, phase: 'playing', currentPlayer: state.leadPlayer })
    setTimeout(() => get()._advanceAI(), 400)
  },

  declareBaila: (trumpSuit: Suit) => {
    set({
      declaration: { type: 'baila', trumpSuit },
      trumpSuit,
      bailaActive: true,
      partnerSitsOut: true,
      phase: 'playing',
      currentPlayer: 0 as Position,
      leadPlayer: 0 as Position,
    })
  },

  declareKiya: () => {
    set({
      declaration: { type: 'kiya' },
      kiyaActive: true,
      partnerSitsOut: true,
      phase: 'playing',
      currentPlayer: 0 as Position,
      leadPlayer: 0 as Position,
    })
  },

  passDeclaration: () => {
    const state = get()
    if (state.phase === 'baila-opportunity') {
      if (state.trumpSelector !== 0) {
        const aiTrump = getAITrumpSelection(state.players[state.trumpSelector].hand)
        set({ trumpSuit: aiTrump, phase: 'kiya-opportunity', currentPlayer: state.leadPlayer })
      } else {
        set({ phase: 'trump-selection' })
      }
    } else if (state.phase === 'kiya-opportunity') {
      set({ phase: 'playing' })
      setTimeout(() => get()._advanceAI(), 400)
    }
  },

  playCard: (card: Card, playerPosition: Position) => {
    const state = get()
    if (state.currentPlayer !== playerPosition) return
    if (state.phase !== 'playing') return

    const newHand = state.players[playerPosition].hand.filter(c => c.id !== card.id)
    const newPlayers = state.players.map((p, i) =>
      i === playerPosition ? { ...p, hand: newHand } : p
    )
    const newTrick: PlayedCard[] = [...state.currentTrick, { card, player: playerPosition }]
    const activePlayers = getActivePlayers(state.partnerSitsOut, 2)

    if (newTrick.length === activePlayers.length) {
      const completed = completeTrick(newTrick, state.trumpSuit)
      const newTricks = [...state.completedTricks, completed]
      const nextLeader = completed.winner as Position

      if (newTricks.length === 8) {
        const result = calculateRoundResult(newTricks, state.declaration)
        const newScores = applyRoundToScore(state.scores, result)
        const isGameOver =
          newScores.team0 >= state.targetScore || newScores.team1 >= state.targetScore
        set({
          players: newPlayers,
          completedTricks: newTricks,
          currentTrick: [],
          scores: newScores,
          roundScores: [...state.roundScores, result],
          phase: isGameOver ? 'game-end' : 'round-end',
        })
        return
      }

      set({
        players: newPlayers,
        completedTricks: newTricks,
        currentTrick: [],
        currentPlayer: nextLeader,
        leadPlayer: nextLeader,
      })
      setTimeout(() => get()._advanceAI(), 400)
      return
    }

    const idx = activePlayers.indexOf(playerPosition)
    const nextPlayer = activePlayers[(idx + 1) % activePlayers.length]
    set({ players: newPlayers, currentTrick: newTrick, currentPlayer: nextPlayer })
    setTimeout(() => get()._advanceAI(), 600)
  },

  nextRound: () => {
    get().dealRound()
  },

  resetGame: () => set(makeBase()),

  _advanceAI: () => {
    const state = get()
    if (state.phase !== 'playing') return
    const current = state.currentPlayer
    if (current === 0) return
    if (state.partnerSitsOut && current === 2) return
    const player = state.players[current]
    const difficulty = 'medium'
    const card = getAIMove(player.hand, state.currentTrick, state.trumpSuit, difficulty, current)
    setTimeout(() => get().playCard(card, current), 500)
  },
}))
