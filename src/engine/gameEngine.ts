import { Card, Suit, Position, PlayedCard, CompletedTrick } from '../types'
import { getCardRank, isKataKola, countKataKola } from './deck'

export function getValidCards(hand: Card[], ledSuit: Suit | null): Card[] {
  if (!ledSuit) return hand
  const suitCards = hand.filter(c => c.suit === ledSuit)
  return suitCards.length > 0 ? suitCards : hand
}

export function determineTrickWinner(trick: PlayedCard[], trumpSuit: Suit | null): Position {
  const ledSuit = trick[0].card.suit
  let best = trick[0]
  for (const played of trick) {
    const bestRank = getCardRank(best.card, trumpSuit, ledSuit)
    const currRank = getCardRank(played.card, trumpSuit, ledSuit)
    if (currRank > bestRank) best = played
  }
  return best.player
}

export function canDeclareBaila(hand: Card[], chosenTrump: Suit): boolean {
  const nonTrumps = hand.filter(c => c.suit !== chosenTrump)
  return nonTrumps.length >= 1
}

export function getActivePlayers(partnerSitsOut: boolean, partnerPosition: Position): Position[] {
  if (!partnerSitsOut) return [0, 1, 2, 3]
  return ([0, 1, 2, 3] as Position[]).filter(p => p !== partnerPosition)
}

export function completeTrick(trick: PlayedCard[], trumpSuit: Suit | null): CompletedTrick {
  const winner = determineTrickWinner(trick, trumpSuit)
  const kataKola = countKataKola(trick.map(p => p.card))
  return { cards: trick, winner, kataKola }
}

export function getTeamTricks(completedTricks: CompletedTrick[], teamId: 0 | 1): CompletedTrick[] {
  return completedTricks.filter(t => t.winner % 2 === teamId)
}
