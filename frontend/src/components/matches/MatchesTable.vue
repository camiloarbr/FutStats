// @author: Victor Chavez | FutStats
<script setup lang="ts">
// 1. External imports
import { computed, ref } from 'vue'

// 2. Internal imports
import type { MatchInterface } from '@/interfaces/MatchInterface'
import { Formatters } from '@/utils/Formatters'

type SortKey = 'date' | 'homeTeam' | 'awayTeam' | 'stadium'

interface Props {
  matches: MatchInterface[]
  teamNames: Record<number, string>
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (event: 'matchClick', id: number): void
}>()

const sortKey = ref<SortKey>('date')
const sortOrder = ref<'asc' | 'desc'>('desc')

const columns: { key: SortKey | 'score'; label: string; sortable: boolean }[] = [
  { key: 'date', label: 'Date', sortable: true },
  { key: 'homeTeam', label: 'Home Team', sortable: true },
  { key: 'score', label: 'Score', sortable: false },
  { key: 'awayTeam', label: 'Away Team', sortable: true },
  { key: 'stadium', label: 'Stadium', sortable: true },
]

function resolveTeamName(teamId: number): string {
  return props.teamNames[teamId] ?? 'Unknown Team'
}

function resolveSortValue(match: MatchInterface): string | number {
  if (sortKey.value === 'date') {
    const resolvedDate = match.date instanceof Date ? match.date : new Date(match.date)
    return resolvedDate.getTime()
  }

  if (sortKey.value === 'homeTeam') {
    return resolveTeamName(match.homeTeamId)
  }

  if (sortKey.value === 'awayTeam') {
    return resolveTeamName(match.awayTeamId)
  }

  return match.stadium
}

function updateSort(key: SortKey | 'score'): void {
  if (key === 'score') {
    return
  }

  if (sortKey.value === key) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
    return
  }

  sortKey.value = key
  sortOrder.value = 'asc'
}

const sortedMatches = computed<MatchInterface[]>(() =>
  [...props.matches].sort((firstMatch, secondMatch) => {
    const firstValue = resolveSortValue(firstMatch)
    const secondValue = resolveSortValue(secondMatch)

    if (firstValue < secondValue) {
      return sortOrder.value === 'asc' ? -1 : 1
    }

    if (firstValue > secondValue) {
      return sortOrder.value === 'asc' ? 1 : -1
    }

    return 0
  })
)
</script>

<template>
  <div class="w-full overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
    <div v-if="props.matches.length === 0" class="py-12 text-center text-sm text-gray-400">
      No matches available
    </div>

    <table v-else class="w-full">
      <thead class="border-b border-gray-200 bg-gray-50">
        <tr>
          <th
            v-for="column in columns"
            :key="column.key"
            class="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
            :class="{ 'cursor-pointer hover:bg-gray-100': column.sortable }"
            @click="updateSort(column.key)"
          >
            {{ column.label }}
            <span v-if="column.sortable && sortKey === column.key" class="text-blue-500">
              {{ sortOrder === 'asc' ? '↑' : '↓' }}
            </span>
          </th>
        </tr>
      </thead>
      <tbody class="divide-y divide-gray-200 bg-white">
        <tr
          v-for="match in sortedMatches"
          :key="match.id"
          class="cursor-pointer transition-colors hover:bg-gray-50"
          @click="emit('matchClick', match.id)"
        >
          <td class="px-6 py-4 text-sm whitespace-nowrap text-gray-800">
            {{ Formatters.formatMatchDate(match.date) }}
          </td>
          <td class="px-6 py-4 text-sm whitespace-nowrap text-gray-800">
            {{ resolveTeamName(match.homeTeamId) }}
          </td>
          <td class="px-6 py-4 text-sm font-semibold whitespace-nowrap text-blue-600">
            {{ Formatters.formatScore(match.homeScore, match.awayScore) }}
          </td>
          <td class="px-6 py-4 text-sm whitespace-nowrap text-gray-800">
            {{ resolveTeamName(match.awayTeamId) }}
          </td>
          <td class="px-6 py-4 text-sm whitespace-nowrap text-gray-800">
            {{ match.stadium }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
