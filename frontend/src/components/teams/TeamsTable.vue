// @author: Victor Chavez | FutStats
<script setup lang="ts">
// 1. External imports
import { computed, ref } from 'vue'

// 2. Internal imports
import type { TeamInterface } from '@/interfaces/TeamInterface'

type SortKey = 'name' | 'country' | 'league' | 'wins' | 'draws' | 'losses' | 'points'

interface Props {
  teams: TeamInterface[]
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (event: 'teamClick', id: number): void
}>()

const sortKey = ref<SortKey>('points')
const sortOrder = ref<'asc' | 'desc'>('desc')

const columns: { key: SortKey; label: string }[] = [
  { key: 'name', label: 'Name' },
  { key: 'country', label: 'Country' },
  { key: 'league', label: 'League' },
  { key: 'wins', label: 'W' },
  { key: 'draws', label: 'D' },
  { key: 'losses', label: 'L' },
  { key: 'points', label: 'Points' },
]

function updateSort(key: SortKey): void {
  if (sortKey.value === key) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
    return
  }

  sortKey.value = key
  sortOrder.value = 'asc'
}

const sortedTeams = computed<TeamInterface[]>(() =>
  [...props.teams].sort((firstTeam, secondTeam) => {
    const firstValue = firstTeam[sortKey.value]
    const secondValue = secondTeam[sortKey.value]

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
    <div v-if="props.teams.length === 0" class="py-12 text-center text-sm text-gray-400">
      No teams available
    </div>

    <table v-else class="w-full">
      <thead class="border-b border-gray-200 bg-gray-50">
        <tr>
          <th
            v-for="column in columns"
            :key="column.key"
            class="cursor-pointer px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase hover:bg-gray-100"
            @click="updateSort(column.key)"
          >
            {{ column.label }}
            <span v-if="sortKey === column.key" class="text-blue-500">
              {{ sortOrder === 'asc' ? '↑' : '↓' }}
            </span>
          </th>
        </tr>
      </thead>
      <tbody class="divide-y divide-gray-200 bg-white">
        <tr
          v-for="team in sortedTeams"
          :key="team.id"
          class="cursor-pointer transition-colors hover:bg-gray-50"
          @click="emit('teamClick', team.id)"
        >
          <td class="px-6 py-4 text-sm whitespace-nowrap text-gray-800">{{ team.name }}</td>
          <td class="px-6 py-4 text-sm whitespace-nowrap text-gray-800">{{ team.country }}</td>
          <td class="px-6 py-4 text-sm whitespace-nowrap text-gray-800">{{ team.league }}</td>
          <td class="px-6 py-4 text-sm whitespace-nowrap text-gray-800">{{ team.wins }}</td>
          <td class="px-6 py-4 text-sm whitespace-nowrap text-gray-800">{{ team.draws }}</td>
          <td class="px-6 py-4 text-sm whitespace-nowrap text-gray-800">{{ team.losses }}</td>
          <td class="px-6 py-4 text-sm font-semibold whitespace-nowrap text-blue-600">
            {{ team.points }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
