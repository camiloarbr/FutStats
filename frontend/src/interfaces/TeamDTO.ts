// @author: Camilo | FutStats
import type { TeamInterface } from '@/interfaces/TeamInterface'

export type CreateTeamDTO = Omit<TeamInterface, 'id'>
export type UpdateTeamDTO = Partial<Omit<TeamInterface, 'id'>>
