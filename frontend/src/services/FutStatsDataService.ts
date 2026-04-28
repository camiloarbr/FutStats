// @author: Camilo | FutStats
// 1. External imports

// 2. Internal imports
import { MatchService } from '@/services/MatchService'
import { PlayerService } from '@/services/PlayerService'
import { TeamService } from '@/services/TeamService'

export class FutStatsDataService {
  static async loadInitialData(): Promise<void> {
    await Promise.all([TeamService.loadAll(), PlayerService.loadAll(), MatchService.loadAll()])
  }
}
