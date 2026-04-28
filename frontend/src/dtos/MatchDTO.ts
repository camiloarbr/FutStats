// @author: Camilo | FutStats
// 1. External imports

// 2. Internal imports
import type { MatchInterface } from '@/interfaces/MatchInterface'

export type CreateMatchDTO = Omit<MatchInterface, 'id'>
export type UpdateMatchDTO = Partial<Omit<MatchInterface, 'id'>>
