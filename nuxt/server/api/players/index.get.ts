// 1. External imports
import { defineEventHandler } from 'h3'

// 2. Internal imports
import type { Player } from '../../../shared/domains/players/player.types'
import { getPlayers } from '../../domains/players/players.repository'

export default defineEventHandler((): readonly Player[] => getPlayers())
