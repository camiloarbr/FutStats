// @author: Camilo | FutStats
import type { MatchInterface } from '@/interfaces/MatchInterface'

export type CreateMatchDTO = Omit<MatchInterface, 'id'>
export type UpdateMatchDTO = Partial<Omit<MatchInterface, 'id'>>
