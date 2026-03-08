// @author: [Name] | FutStats

export interface TeamInterface {
  id: number
  imageUrl: string
  name: string
  country: string
  league: string
  foundedYear: number
  matchesPlayed: number
  wins: number
  draws: number
  losses: number
  goalsFor: number
  goalsAgainst: number
  points: number
}

export type CreateTeamDTO = Omit<TeamInterface, 'id'>
