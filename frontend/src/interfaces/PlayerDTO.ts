// @author: Camilo | FutStats
import type { PlayerInterface } from '@/interfaces/PlayerInterface'

export type CreatePlayerDTO = Omit<PlayerInterface, 'id'>
export type UpdatePlayerDTO = Partial<Omit<PlayerInterface, 'id'>>
