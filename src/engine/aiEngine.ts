import { Card, Suit, Position, PlayedCard, Difficulty } from '../types'
import { getValidCards } from './gameEngine'
import { getCardRank } from './deck'

export function getAIMove(
  hand: Card[],
  currentTrick: PlayedCard[],
  trumpSuit: Suit | null,
  difficulty: Difficulty,
  _position: Position
): Card {
  const ledSuit = currentTrick.length > 0 ? currentTrick[0].card.suit : null
  const validCards = getValidCards(hand, ledSuit)

  if (difficulty === 'easy') {
    return validCards[Math.floor(Math.random() * validCards.length)]
  }
  if (difficulty === 'medium') {
    return getMediumCard(validCards, currentTrick, trumpSuit, ledSuit)
  }
  return getHardCard(validCards, currentTrick, trumpSuit, ledSuit)
}

function getMediumCard(
  validCards: Card[],
  currentTrick: PlayedCard[],
  trumpSuit: Suit | null,
  ledSuit: Suit | null
): Card {
  if (currentTrick.length === 0) {
    return sortByRank(validCards, trumpSuit, validCards[0].suit)[0]
  }
  const ls = ledSuit!
  const bestInTrick = getBestCard(currentTrick, trumpSuit, ls)
  const bestRank = getCardRank(bestInTrick, trumpSuit, ls)
  const winners = validCards.filter(c => getCardRank(c, trumpSuit, ls) > bestRank)
  if (winners.length > 0) return sortByRank(winners, trumpSuit, ls)[0]
  return sortByRank(validCards, trumpSuit, ls)[0]
}

function getHardCard(
  validCards: Card[],
  currentTrick: PlayedCard[],
  trumpSuit: Suit | null,
  ledSuit: Suit | null
): Card {
  if (currentTrick.length === 0) {
    const nonTrumps = validCards.filter(c => c.suit !== trumpSuit)
    const pool = nonTrumps.length > 0 ? nonTrumps : validCards
    const sorted = sortByRank(pool, trumpSuit, pool[0].suit)
    return sorted[sorted.length - 1]
  }
  return getMediumCard(validCards, currentTrick, trumpSuit, ledSuit)
}

function getBestCard(trick: PlayedCard[], trumpSuit: Suit | null, ledSuit: Suit): Card {
  return trick.reduce((best, cur) =>
    getCardRank(cur.card, trumpSuit, ledSuit) > getCardRank(best.card, trumpSuit, ledSuit) ? cur : best
  ).card
}

function sortByRank(cards: Card[], trumpSuit: Suit | null, ledSuit: Suit): Card[] {
  return [...cards].sort(
    (a, b) => getCardRank(a, trumpSuit, ledSuit) - getCardRank(b, trumpSuit, ledSuit)
  )
}

export function getAITrumpSelection(hand: Card[]): Suit {
  const counts: Record<Suit, number> = { spades: 0, hearts: 0, diamonds: 0, clubs: 0 }
  for (const card of hand) counts[card.suit]++
  const entries = Object.entries(counts) as [Suit, number][]
  return entries.sort((a, b) => b[1] - a[1])[0][0]
}
