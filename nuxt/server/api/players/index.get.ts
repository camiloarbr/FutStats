// 1. External imports

// 2. Internal imports
import type { Player } from '../../../shared/domains/players/player.types'
import { getPlayers } from '../../domains/players/players.repository'

export default defineEventHandler((): readonly Player[] => getPlayers())
