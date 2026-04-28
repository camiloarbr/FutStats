// @author: Camilo | FutStats
// 1. External imports

// 2. Internal imports
import type { TeamInterface } from '@/interfaces/TeamInterface'

export type CreateTeamDTO = Omit<TeamInterface, 'id'>
export type UpdateTeamDTO = Partial<Omit<TeamInterface, 'id'>>
