// @author: Camilo | FutStats
// 1. External imports

// 2. Internal imports
import { MatchService } from '@/services/MatchService'
import { PlayerService } from '@/services/PlayerService'
import { TeamService } from '@/services/TeamService'
import { useDataStatusStore } from '@/stores/useDataStatusStore'

export class FutStatsDataService {
  static async loadInitialData(): Promise<void> {
    const dataStatusStore = useDataStatusStore()
    dataStatusStore.startLoading()

    try {
      await Promise.all([TeamService.loadAll(), PlayerService.loadAll(), MatchService.loadAll()])
      dataStatusStore.finishLoading()
    } catch {
      dataStatusStore.failLoading(
        'Unable to load data from the back-end. Check that the API is running and try again.'
      )
    }
  }
}
