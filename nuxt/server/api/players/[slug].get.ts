// 1. External imports

// 2. Internal imports
import type { Player } from '../../../shared/domains/players/player.types'
import { getPlayerBySlug } from '../../domains/players/players.repository'

export default defineEventHandler((event): Player => {
  const slug = getRouterParam(event, 'slug') ?? ''

  const player = getPlayerBySlug(slug)

  if (player === undefined) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Jugador no encontrado.',
    })
  }

  return player
})
