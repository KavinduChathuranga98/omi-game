import { Card, Suit, CardValue } from '../types'

const SUITS: Suit[] = ['spades', 'hearts', 'diamonds', 'clubs']
const VALUES: CardValue[] = [2, 3, 4, 5, 6, 7, 8, 9, 10, 'J', 'Q', 'K', 'A']

export function createDeck(): Card[] {
  const deck: Card[] = []
  for (const suit of SUITS) {
    for (const value of VALUES) {
      deck.push({ suit, value, id: `${value}_${suit}` })
    }
  }
  return deck
}

export function shuffleDeck(deck: Card[]): Card[] {
  const d = [...deck]
  for (let i = d.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[d[i], d[j]] = [d[j], d[i]]
  }
  return d
}

export function dealCards(deck: Card[]): [Card[], Card[], Card[], Card[]] {
  const shuffled = shuffleDeck(deck)
  return [
    shuffled.slice(0, 13),
    shuffled.slice(13, 26),
    shuffled.slice(26, 39),
    shuffled.slice(39, 52),
  ]
}

export function getCardNumericValue(value: CardValue): number {
  if (typeof value === 'number') return value
  const map: Record<string, number> = { J: 11, Q: 12, K: 13, A: 14 }
  return map[value]
}

export function getCardRank(card: Card, trumpSuit: Suit | null, ledSuit: Suit): number {
  const base = getCardNumericValue(card.value)
  if (card.suit === trumpSuit) return base + 100
  if (card.suit === ledSuit) return base
  return 0
}

export function isKataKola(card: Card): boolean {
  const kataValues: CardValue[] = [10, 'J', 'Q', 'K', 'A']
  return kataValues.includes(card.value)
}

export function countKataKola(cards: Card[]): number {
  return cards.filter(isKataKola).length
}

export function getSuitSymbol(suit: Suit): string {
  const symbols: Record<Suit, string> = {
    spades: '♠',
    hearts: '♥',
    diamonds: '♦',
    clubs: '♣',
  }
  return symbols[suit]
}

export function getSuitColor(suit: Suit): string {
  return suit === 'hearts' || suit === 'diamonds' ? '#e53935' : '#1a1a2e'
}

export function getCardDisplayValue(value: CardValue): string {
  return String(value)
}
