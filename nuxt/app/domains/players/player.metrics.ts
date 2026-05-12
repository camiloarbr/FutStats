// 1. External imports

// 2. Internal imports
import type { Player } from './player.types'

export function calculateGoalParticipation(player: Player): number {
  return player.goles + player.asistencias
}

export function calculateContributionRate(player: Player): string {
  const rate = calculateGoalParticipation(player) / player.partidosJugados

  return rate.toFixed(2)
}

export function sortPlayersByGoalParticipation(
  players: readonly Player[],
): Player[] {
  return [...players].sort(
    (firstPlayer, secondPlayer) =>
      calculateGoalParticipation(secondPlayer) -
      calculateGoalParticipation(firstPlayer),
  )
}
