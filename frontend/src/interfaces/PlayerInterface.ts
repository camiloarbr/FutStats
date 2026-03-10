// @author: Camilo | FutStats

export interface PlayerInterface {
  id: number
  imageUrl: string
  fullName: string
  position: string
  nationality: string
  shirtNumber: number
  matchesPlayed: number
  goals: number
  assists: number
  shots: number
  passes: number
  yellowCards: number
  redCards: number
  minutesPlayed: number
  teamId: number
}

export type CreatePlayerDTO = Omit<PlayerInterface, 'id'>
