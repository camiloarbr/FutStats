// 1. External imports
import { createError, defineEventHandler, getRouterParam } from 'h3'

// 2. Internal imports
import type { Player } from '../../../shared/domains/players/player.types'
import { getPlayerById } from '../../domains/players/players.repository'

export default defineEventHandler((event): Player => {
  const idParam = getRouterParam(event, 'id')
  const playerId = Number(idParam)

  if (!Number.isInteger(playerId)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'El id del jugador debe ser numerico.',
    })
  }

  const player = getPlayerById(playerId)

  if (player === undefined) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Jugador no encontrado.',
    })
  }

  return player
})
