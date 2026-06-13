export type Suit = 'spades' | 'hearts' | 'diamonds' | 'clubs'
export type CardValue = 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 'J' | 'Q' | 'K' | 'A'

export interface Card {
  suit: Suit
  value: CardValue
  id: string
}

// 0=South (human), 1=West (AI), 2=North (partner/AI), 3=East (AI)
export type Position = 0 | 1 | 2 | 3

export interface Player {
  position: Position
  name: string
  hand: Card[]
  isHuman: boolean
  teamId: 0 | 1
}

export interface PlayedCard {
  card: Card
  player: Position
}

export interface CompletedTrick {
  cards: PlayedCard[]
  winner: Position
  kataKola: number
}

export type Declaration =
  | { type: 'baila'; trumpSuit: Suit }
  | { type: 'kiya' }

export type GameMode = 'classic' | 'modern'

export type GamePhase =
  | 'menu'
  | 'dealing'
  | 'baila-opportunity'
  | 'trump-selection'
  | 'kiya-opportunity'
  | 'playing'
  | 'round-end'
  | 'game-end'

export interface TeamScore {
  team0: number
  team1: number
}

export interface RoundResult {
  team0Kata: number
  team1Kata: number
  team0Tricks: number
  team1Tricks: number
  declarationBonus: number
  winner: 0 | 1
}

export interface GameState {
  phase: GamePhase
  players: Player[]
  currentTrick: PlayedCard[]
  completedTricks: CompletedTrick[]
  trumpSuit: Suit | null
  currentPlayer: Position
  leadPlayer: Position
  declaration: Declaration | null
  scores: TeamScore
  roundScores: RoundResult[]
  roundNumber: number
  gameMode: GameMode
  dealer: Position
  trumpSelector: Position
  partnerSitsOut: boolean
  kiyaActive: boolean
  bailaActive: boolean
  targetScore: number
}

export type Language = 'en' | 'si'
export type Difficulty = 'easy' | 'medium' | 'hard'

export interface Settings {
  language: Language
  difficulty: Difficulty
  gameMode: GameMode
  targetScore: number
  soundEnabled: boolean
}
