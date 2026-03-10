// @author: Camilo | FutStats

export interface MatchInterface {
  id: number
  date: Date
  stadium: string
  homeScore: number
  awayScore: number
  possessionHome: number
  possessionAway: number
  shotsHome: number
  shotsAway: number
  foulsHome: number
  foulsAway: number
  homeTeamId: number
  awayTeamId: number
}

export type CreateMatchDTO = Omit<MatchInterface, 'id'>
