// 1. External imports

// 2. Internal imports
import type { Player } from '../../../shared/domains/players/player.types'
import { players } from './players.data'

export function getPlayers(): readonly Player[] {
  return players
}

export function getPlayerBySlug(slug: string): Player | undefined {
  return players.find((player) => player.slug === slug)
}
