// @author: Camilo | FutStats
import type { MatchInterface } from '@/interfaces/MatchInterface'
import type { PlayerInterface } from '@/interfaces/PlayerInterface'
import type { TeamInterface } from '@/interfaces/TeamInterface'
import type { UserInterface } from '@/interfaces/UserInterface'

export class LocalStorageUtils {
  private static readonly KEY = import.meta.env.VITE_STORAGE_KEY as string
  private static readonly SEEDED_FLAG = `${LocalStorageUtils.KEY}_seeded`
  private static readonly CURRENT_USER_KEY = `${LocalStorageUtils.KEY}_currentUserId`

  static isSeeded(): boolean {
    return localStorage.getItem(LocalStorageUtils.SEEDED_FLAG) === 'true'
  }

  static markAsSeeded(): void {
    localStorage.setItem(LocalStorageUtils.SEEDED_FLAG, 'true')
  }

  static clear(): void {
    const keysToRemove: string[] = []

    for (let index = 0; index < localStorage.length; index += 1) {
      const key = localStorage.key(index)

      if (key !== null && key.startsWith(LocalStorageUtils.KEY)) {
        keysToRemove.push(key)
      }
    }

    keysToRemove.forEach((key: string) => {
      localStorage.removeItem(key)
    })
  }

  static saveTeams(teams: TeamInterface[]): void {
    localStorage.setItem(`${LocalStorageUtils.KEY}_teams`, JSON.stringify(teams))
  }

  static loadTeams(): TeamInterface[] {
    const rawTeams = localStorage.getItem(`${LocalStorageUtils.KEY}_teams`)

    if (rawTeams === null) {
      return []
    }

    const parsedTeams = JSON.parse(rawTeams) as unknown
    return parsedTeams as TeamInterface[]
  }

  static savePlayers(players: PlayerInterface[]): void {
    localStorage.setItem(`${LocalStorageUtils.KEY}_players`, JSON.stringify(players))
  }

  static loadPlayers(): PlayerInterface[] {
    const rawPlayers = localStorage.getItem(`${LocalStorageUtils.KEY}_players`)

    if (rawPlayers === null) {
      return []
    }

    const parsedPlayers = JSON.parse(rawPlayers) as unknown
    return parsedPlayers as PlayerInterface[]
  }

  static saveMatches(matches: MatchInterface[]): void {
    localStorage.setItem(`${LocalStorageUtils.KEY}_matches`, JSON.stringify(matches))
  }

  static loadMatches(): MatchInterface[] {
    const rawMatches = localStorage.getItem(`${LocalStorageUtils.KEY}_matches`)

    if (rawMatches === null) {
      return []
    }

    const parsedMatches = JSON.parse(rawMatches) as unknown
    const matchesArray = parsedMatches as MatchInterface[]

    return matchesArray.map((match: MatchInterface) => ({
      ...match,
      date: new Date(match.date),
    }))
  }

  static saveUsers(users: UserInterface[]): void {
    localStorage.setItem(`${LocalStorageUtils.KEY}_users`, JSON.stringify(users))
  }

  static loadUsers(): UserInterface[] {
    const rawUsers = localStorage.getItem(`${LocalStorageUtils.KEY}_users`)

    if (rawUsers === null) {
      return []
    }

    const parsedUsers = JSON.parse(rawUsers) as unknown
    const usersArray = parsedUsers as UserInterface[]

    return usersArray.map((user: UserInterface) => ({
      ...user,
      createdAt: new Date(user.createdAt),
    }))
  }

  static saveCurrentUserId(userId: number | null): void {
    if (userId === null) {
      localStorage.removeItem(LocalStorageUtils.CURRENT_USER_KEY)
      return
    }

    localStorage.setItem(LocalStorageUtils.CURRENT_USER_KEY, userId.toString())
  }

  static loadCurrentUserId(): number | null {
    const stored = localStorage.getItem(LocalStorageUtils.CURRENT_USER_KEY)

    if (stored === null) {
      return null
    }

    const parsed = Number(stored)
    return Number.isNaN(parsed) ? null : parsed
  }

  static seed(): void {
    if (LocalStorageUtils.isSeeded()) {
      return
    }

    const teams: TeamInterface[] = [
      {
        id: 1,
        name: 'Real Madrid',
        country: 'Spain',
        league: 'La Liga',
        foundedYear: 1902,
        imageUrl: 'https://upload.wikimedia.org/wikipedia/en/5/56/Real_Madrid_CF.svg',
        matchesPlayed: 10,
        wins: 7,
        draws: 2,
        losses: 1,
        goalsFor: 22,
        goalsAgainst: 8,
        points: 23,
      },
      {
        id: 2,
        name: 'FC Barcelona',
        country: 'Spain',
        league: 'La Liga',
        foundedYear: 1899,
        imageUrl: 'https://upload.wikimedia.org/wikipedia/en/4/47/FC_Barcelona_%28crest%29.svg',
        matchesPlayed: 10,
        wins: 6,
        draws: 2,
        losses: 2,
        goalsFor: 18,
        goalsAgainst: 10,
        points: 20,
      },
      {
        id: 3,
        name: 'Manchester City',
        country: 'England',
        league: 'Premier League',
        foundedYear: 1880,
        imageUrl: 'https://upload.wikimedia.org/wikipedia/en/e/eb/Manchester_City_FC_badge.svg',
        matchesPlayed: 10,
        wins: 6,
        draws: 3,
        losses: 1,
        goalsFor: 20,
        goalsAgainst: 9,
        points: 21,
      },
      {
        id: 4,
        name: 'Bayern Munich',
        country: 'Germany',
        league: 'Bundesliga',
        foundedYear: 1900,
        imageUrl:
          'https://upload.wikimedia.org/wikipedia/commons/1/1b/FC_Bayern_M%C3%BCnchen_logo_%282017%29.svg',
        matchesPlayed: 10,
        wins: 8,
        draws: 1,
        losses: 1,
        goalsFor: 25,
        goalsAgainst: 7,
        points: 25,
      },
      {
        id: 5,
        name: 'Paris Saint-Germain',
        country: 'France',
        league: 'Ligue 1',
        foundedYear: 1970,
        imageUrl: 'https://upload.wikimedia.org/wikipedia/en/a/a7/Paris_Saint-Germain_F.C..svg',
        matchesPlayed: 10,
        wins: 5,
        draws: 3,
        losses: 2,
        goalsFor: 17,
        goalsAgainst: 12,
        points: 18,
      },
      {
        id: 6,
        name: 'Juventus',
        country: 'Italy',
        league: 'Serie A',
        foundedYear: 1897,
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/1/15/Juventus_FC_2017_icon.svg',
        matchesPlayed: 10,
        wins: 5,
        draws: 2,
        losses: 3,
        goalsFor: 14,
        goalsAgainst: 11,
        points: 17,
      },
    ]

    const players: PlayerInterface[] = [
      {
        id: 1,
        imageUrl: 'https://example.com/players/courtois.jpg',
        fullName: 'Thibaut Courtois',
        position: 'Goalkeeper',
        nationality: 'Belgium',
        shirtNumber: 1,
        matchesPlayed: 10,
        goals: 0,
        assists: 0,
        shots: 0,
        passes: 220,
        yellowCards: 1,
        redCards: 0,
        minutesPlayed: 900,
        teamId: 1,
      },
      {
        id: 2,
        imageUrl: 'https://example.com/players/valverde.jpg',
        fullName: 'Federico Valverde',
        position: 'Midfielder',
        nationality: 'Uruguay',
        shirtNumber: 15,
        matchesPlayed: 10,
        goals: 4,
        assists: 5,
        shots: 26,
        passes: 520,
        yellowCards: 2,
        redCards: 0,
        minutesPlayed: 850,
        teamId: 1,
      },
      {
        id: 3,
        imageUrl: 'https://example.com/players/vinicius.jpg',
        fullName: 'Vinicius Junior',
        position: 'Forward',
        nationality: 'Brazil',
        shirtNumber: 7,
        matchesPlayed: 10,
        goals: 10,
        assists: 4,
        shots: 34,
        passes: 260,
        yellowCards: 3,
        redCards: 0,
        minutesPlayed: 840,
        teamId: 1,
      },
      {
        id: 4,
        imageUrl: 'https://example.com/players/ter-stegen.jpg',
        fullName: 'Marc-Andre ter Stegen',
        position: 'Goalkeeper',
        nationality: 'Germany',
        shirtNumber: 1,
        matchesPlayed: 10,
        goals: 0,
        assists: 1,
        shots: 0,
        passes: 240,
        yellowCards: 0,
        redCards: 0,
        minutesPlayed: 900,
        teamId: 2,
      },
      {
        id: 5,
        imageUrl: 'https://example.com/players/pedri.jpg',
        fullName: 'Pedri Gonzalez',
        position: 'Midfielder',
        nationality: 'Spain',
        shirtNumber: 8,
        matchesPlayed: 9,
        goals: 5,
        assists: 6,
        shots: 21,
        passes: 540,
        yellowCards: 2,
        redCards: 0,
        minutesPlayed: 790,
        teamId: 2,
      },
      {
        id: 6,
        imageUrl: 'https://example.com/players/lewandowski.jpg',
        fullName: 'Robert Lewandowski',
        position: 'Forward',
        nationality: 'Poland',
        shirtNumber: 9,
        matchesPlayed: 10,
        goals: 11,
        assists: 3,
        shots: 31,
        passes: 190,
        yellowCards: 1,
        redCards: 0,
        minutesPlayed: 860,
        teamId: 2,
      },
      {
        id: 7,
        imageUrl: 'https://example.com/players/ederson.jpg',
        fullName: 'Ederson Moraes',
        position: 'Goalkeeper',
        nationality: 'Brazil',
        shirtNumber: 31,
        matchesPlayed: 10,
        goals: 0,
        assists: 1,
        shots: 0,
        passes: 300,
        yellowCards: 1,
        redCards: 0,
        minutesPlayed: 900,
        teamId: 3,
      },
      {
        id: 8,
        imageUrl: 'https://example.com/players/rodri.jpg',
        fullName: 'Rodri Hernandez',
        position: 'Midfielder',
        nationality: 'Spain',
        shirtNumber: 16,
        matchesPlayed: 10,
        goals: 6,
        assists: 5,
        shots: 24,
        passes: 680,
        yellowCards: 2,
        redCards: 0,
        minutesPlayed: 890,
        teamId: 3,
      },
      {
        id: 9,
        imageUrl: 'https://example.com/players/haaland.jpg',
        fullName: 'Erling Haaland',
        position: 'Forward',
        nationality: 'Norway',
        shirtNumber: 9,
        matchesPlayed: 10,
        goals: 13,
        assists: 4,
        shots: 37,
        passes: 170,
        yellowCards: 1,
        redCards: 0,
        minutesPlayed: 875,
        teamId: 3,
      },
      {
        id: 10,
        imageUrl: 'https://example.com/players/neuer.jpg',
        fullName: 'Manuel Neuer',
        position: 'Goalkeeper',
        nationality: 'Germany',
        shirtNumber: 1,
        matchesPlayed: 10,
        goals: 0,
        assists: 0,
        shots: 0,
        passes: 250,
        yellowCards: 1,
        redCards: 0,
        minutesPlayed: 900,
        teamId: 4,
      },
      {
        id: 11,
        imageUrl: 'https://example.com/players/kimmich.jpg',
        fullName: 'Joshua Kimmich',
        position: 'Midfielder',
        nationality: 'Germany',
        shirtNumber: 6,
        matchesPlayed: 10,
        goals: 4,
        assists: 7,
        shots: 20,
        passes: 700,
        yellowCards: 2,
        redCards: 0,
        minutesPlayed: 880,
        teamId: 4,
      },
      {
        id: 12,
        imageUrl: 'https://example.com/players/kane.jpg',
        fullName: 'Harry Kane',
        position: 'Forward',
        nationality: 'England',
        shirtNumber: 9,
        matchesPlayed: 10,
        goals: 12,
        assists: 5,
        shots: 35,
        passes: 230,
        yellowCards: 1,
        redCards: 0,
        minutesPlayed: 870,
        teamId: 4,
      },
      {
        id: 13,
        imageUrl: 'https://example.com/players/donnarumma.jpg',
        fullName: 'Gianluigi Donnarumma',
        position: 'Goalkeeper',
        nationality: 'Italy',
        shirtNumber: 99,
        matchesPlayed: 10,
        goals: 0,
        assists: 0,
        shots: 0,
        passes: 215,
        yellowCards: 0,
        redCards: 0,
        minutesPlayed: 900,
        teamId: 5,
      },
      {
        id: 14,
        imageUrl: 'https://example.com/players/marquinhos.jpg',
        fullName: 'Marquinhos',
        position: 'Defender',
        nationality: 'Brazil',
        shirtNumber: 5,
        matchesPlayed: 10,
        goals: 1,
        assists: 2,
        shots: 10,
        passes: 610,
        yellowCards: 2,
        redCards: 0,
        minutesPlayed: 890,
        teamId: 5,
      },
      {
        id: 15,
        imageUrl: 'https://example.com/players/vitinha.jpg',
        fullName: 'Vitinha',
        position: 'Midfielder',
        nationality: 'Portugal',
        shirtNumber: 17,
        matchesPlayed: 10,
        goals: 5,
        assists: 6,
        shots: 19,
        passes: 650,
        yellowCards: 1,
        redCards: 0,
        minutesPlayed: 860,
        teamId: 5,
      },
      {
        id: 16,
        imageUrl: 'https://example.com/players/dembele.jpg',
        fullName: 'Ousmane Dembele',
        position: 'Forward',
        nationality: 'France',
        shirtNumber: 10,
        matchesPlayed: 10,
        goals: 9,
        assists: 5,
        shots: 30,
        passes: 260,
        yellowCards: 2,
        redCards: 0,
        minutesPlayed: 830,
        teamId: 5,
      },
      {
        id: 17,
        imageUrl: 'https://example.com/players/szczesny.jpg',
        fullName: 'Wojciech Szczesny',
        position: 'Goalkeeper',
        nationality: 'Poland',
        shirtNumber: 1,
        matchesPlayed: 10,
        goals: 0,
        assists: 0,
        shots: 0,
        passes: 210,
        yellowCards: 1,
        redCards: 0,
        minutesPlayed: 900,
        teamId: 6,
      },
      {
        id: 18,
        imageUrl: 'https://example.com/players/danilo.jpg',
        fullName: 'Danilo Luiz',
        position: 'Defender',
        nationality: 'Brazil',
        shirtNumber: 6,
        matchesPlayed: 9,
        goals: 1,
        assists: 2,
        shots: 9,
        passes: 500,
        yellowCards: 4,
        redCards: 0,
        minutesPlayed: 790,
        teamId: 6,
      },
      {
        id: 19,
        imageUrl: 'https://example.com/players/locatelli.jpg',
        fullName: 'Manuel Locatelli',
        position: 'Midfielder',
        nationality: 'Italy',
        shirtNumber: 5,
        matchesPlayed: 10,
        goals: 4,
        assists: 5,
        shots: 17,
        passes: 590,
        yellowCards: 3,
        redCards: 0,
        minutesPlayed: 865,
        teamId: 6,
      },
      {
        id: 20,
        imageUrl: 'https://example.com/players/vlahovic.jpg',
        fullName: 'Dusan Vlahovic',
        position: 'Forward',
        nationality: 'Serbia',
        shirtNumber: 9,
        matchesPlayed: 10,
        goals: 10,
        assists: 3,
        shots: 28,
        passes: 175,
        yellowCards: 2,
        redCards: 1,
        minutesPlayed: 845,
        teamId: 6,
      },
    ]

    const matches: MatchInterface[] = [
      {
        id: 1,
        date: new Date('2025-12-14T20:00:00'),
        stadium: 'Santiago Bernabeu',
        homeScore: 2,
        awayScore: 1,
        possessionHome: 54,
        possessionAway: 46,
        shotsHome: 15,
        shotsAway: 11,
        foulsHome: 10,
        foulsAway: 12,
        homeTeamId: 1,
        awayTeamId: 2,
      },
      {
        id: 2,
        date: new Date('2025-12-22T18:30:00'),
        stadium: 'Etihad Stadium',
        homeScore: 3,
        awayScore: 1,
        possessionHome: 61,
        possessionAway: 39,
        shotsHome: 18,
        shotsAway: 9,
        foulsHome: 8,
        foulsAway: 14,
        homeTeamId: 3,
        awayTeamId: 6,
      },
      {
        id: 3,
        date: new Date('2026-01-05T21:00:00'),
        stadium: 'Allianz Arena',
        homeScore: 2,
        awayScore: 0,
        possessionHome: 57,
        possessionAway: 43,
        shotsHome: 16,
        shotsAway: 8,
        foulsHome: 9,
        foulsAway: 13,
        homeTeamId: 4,
        awayTeamId: 5,
      },
      {
        id: 4,
        date: new Date('2026-01-13T20:45:00'),
        stadium: 'Parc des Princes',
        homeScore: 1,
        awayScore: 1,
        possessionHome: 49,
        possessionAway: 51,
        shotsHome: 12,
        shotsAway: 13,
        foulsHome: 11,
        foulsAway: 11,
        homeTeamId: 5,
        awayTeamId: 2,
      },
      {
        id: 5,
        date: new Date('2026-01-21T19:00:00'),
        stadium: 'Allianz Stadium',
        homeScore: 2,
        awayScore: 2,
        possessionHome: 47,
        possessionAway: 53,
        shotsHome: 10,
        shotsAway: 14,
        foulsHome: 14,
        foulsAway: 9,
        homeTeamId: 6,
        awayTeamId: 1,
      },
      {
        id: 6,
        date: new Date('2026-01-30T20:00:00'),
        stadium: 'Estadi Olimpic Lluis Companys',
        homeScore: 0,
        awayScore: 1,
        possessionHome: 58,
        possessionAway: 42,
        shotsHome: 14,
        shotsAway: 7,
        foulsHome: 10,
        foulsAway: 15,
        homeTeamId: 2,
        awayTeamId: 4,
      },
      {
        id: 7,
        date: new Date('2026-02-07T17:30:00'),
        stadium: 'Santiago Bernabeu',
        homeScore: 4,
        awayScore: 2,
        possessionHome: 52,
        possessionAway: 48,
        shotsHome: 19,
        shotsAway: 12,
        foulsHome: 8,
        foulsAway: 12,
        homeTeamId: 1,
        awayTeamId: 3,
      },
      {
        id: 8,
        date: new Date('2026-02-15T20:00:00'),
        stadium: 'Parc des Princes',
        homeScore: 2,
        awayScore: 1,
        possessionHome: 55,
        possessionAway: 45,
        shotsHome: 13,
        shotsAway: 10,
        foulsHome: 9,
        foulsAway: 16,
        homeTeamId: 5,
        awayTeamId: 6,
      },
      {
        id: 9,
        date: new Date('2026-02-22T18:00:00'),
        stadium: 'Allianz Arena',
        homeScore: 3,
        awayScore: 0,
        possessionHome: 60,
        possessionAway: 40,
        shotsHome: 17,
        shotsAway: 6,
        foulsHome: 7,
        foulsAway: 12,
        homeTeamId: 4,
        awayTeamId: 3,
      },
      {
        id: 10,
        date: new Date('2026-03-01T19:45:00'),
        stadium: 'Allianz Stadium',
        homeScore: 1,
        awayScore: 0,
        possessionHome: 51,
        possessionAway: 49,
        shotsHome: 11,
        shotsAway: 9,
        foulsHome: 12,
        foulsAway: 10,
        homeTeamId: 6,
        awayTeamId: 2,
      },
    ]

    const users: UserInterface[] = [
      {
        id: 1,
        username: 'Admin User',
        email: 'admin@futstats.com',
        passwordHash: 'admin123',
        role: 'admin',
        createdAt: new Date('2024-01-01'),
        isActive: true,
      },
      {
        id: 2,
        username: 'Standard User',
        email: 'user@futstats.com',
        passwordHash: 'user123',
        role: 'user',
        createdAt: new Date('2024-01-01'),
        isActive: true,
      },
    ]

    LocalStorageUtils.saveTeams(teams)
    LocalStorageUtils.savePlayers(players)
    LocalStorageUtils.saveMatches(matches)
    LocalStorageUtils.saveUsers(users)
    LocalStorageUtils.markAsSeeded()
  }
}
