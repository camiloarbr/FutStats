// @author: Samuel | FutStats
import { useMatchesStore } from '@/stores/useMatchesStore'
import type { MatchInterface } from '@/interfaces/MatchInterface'

export class MatchService {
  static getAll(): MatchInterface[] {
    const matchesStore = useMatchesStore()
    return matchesStore.matches
  }
}