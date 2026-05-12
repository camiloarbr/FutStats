// 1. External imports

// 2. Internal imports
import type { Player } from './player.types'

export function calculateGoalParticipation(player: Player): number {
  return player.goles + player.asistencias
}

export function calculateContributionRate(player: Player): number {
  return calculateGoalParticipation(player) / player.partidosJugados
}

export function sortPlayersByGoalParticipation(
  players: readonly Player[],
): Player[] {
  return [...players].sort(
    (a, b) => calculateGoalParticipation(b) - calculateGoalParticipation(a),
  )
}
