// @author: Camilo | FutStats
// 1. External imports

// 2. Internal imports
import type { PlayerInterface } from '@/interfaces/PlayerInterface'

export type CreatePlayerDTO = Omit<PlayerInterface, 'id'>
export type UpdatePlayerDTO = Partial<Omit<PlayerInterface, 'id'>>
