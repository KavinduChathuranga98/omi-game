import { CompletedTrick, Declaration, RoundResult } from '../types'
import { getTeamTricks } from './gameEngine'

export function calculateRoundResult(
  completedTricks: CompletedTrick[],
  declaration: Declaration | null
): RoundResult {
  const team0Tricks = getTeamTricks(completedTricks, 0)
  const team1Tricks = getTeamTricks(completedTricks, 1)
  const team0Kata = team0Tricks.reduce((sum, t) => sum + t.kataKola, 0)
  const team1Kata = team1Tricks.reduce((sum, t) => sum + t.kataKola, 0)

  let declarationBonus = 0
  let winner: 0 | 1 = team0Kata >= team1Kata ? 0 : 1

  if (declaration?.type === 'kiya') {
    if (team0Tricks.length === 8) {
      declarationBonus = 3
      winner = 0
    } else {
      declarationBonus = -5
      winner = 1
    }
  } else if (declaration?.type === 'baila') {
    if (team0Tricks.length >= 4) {
      declarationBonus = 2
      winner = 0
    } else {
      declarationBonus = -3
      winner = 1
    }
  }

  return {
    team0Kata,
    team1Kata,
    team0Tricks: team0Tricks.length,
    team1Tricks: team1Tricks.length,
    declarationBonus,
    winner,
  }
}

export function applyRoundToScore(
  current: { team0: number; team1: number },
  result: RoundResult
): { team0: number; team1: number } {
  const bonus = result.declarationBonus > 0 ? result.declarationBonus : 0
  const penalty = result.declarationBonus < 0 ? Math.abs(result.declarationBonus) : 0
  return {
    team0: current.team0 + result.team0Kata + (result.winner === 0 ? bonus : 0),
    team1: current.team1 + result.team1Kata + (result.winner === 1 ? 0 : penalty),
  }
}
