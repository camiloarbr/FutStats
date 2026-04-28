// @author: Victor Chavez | FutStats
<script setup lang="ts">
// 1. External imports
import { computed, ref } from 'vue'

// 2. Internal imports
import type { PlayerInterface } from '@/interfaces/PlayerInterface'

type SortKey = 'fullName' | 'team' | 'position' | 'goals' | 'assists' | 'matchesPlayed'

interface Props {
  players: PlayerInterface[]
  teamNames: Record<number, string>
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (event: 'playerClick', id: number): void
}>()

const sortKey = ref<SortKey>('goals')
const sortOrder = ref<'asc' | 'desc'>('desc')

const columns: { key: SortKey; label: string }[] = [
  { key: 'fullName', label: 'Name' },
  { key: 'team', label: 'Team' },
  { key: 'position', label: 'Position' },
  { key: 'goals', label: 'Goals' },
  { key: 'assists', label: 'Assists' },
  { key: 'matchesPlayed', label: 'Matches' },
]

function resolveTeamName(teamId: number): string {
  return props.teamNames[teamId] ?? 'Unknown Team'
}

function resolveSortValue(player: PlayerInterface): string | number {
  if (sortKey.value === 'team') {
    return resolveTeamName(player.teamId)
  }

  return player[sortKey.value]
}

function updateSort(key: SortKey): void {
  if (sortKey.value === key) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
    return
  }

  sortKey.value = key
  sortOrder.value = 'asc'
}

const sortedPlayers = computed<PlayerInterface[]>(() =>
  [...props.players].sort((firstPlayer, secondPlayer) => {
    const firstValue = resolveSortValue(firstPlayer)
    const secondValue = resolveSortValue(secondPlayer)

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
    <div v-if="props.players.length === 0" class="py-12 text-center text-sm text-gray-400">
      No players available
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
          v-for="player in sortedPlayers"
          :key="player.id"
          class="cursor-pointer transition-colors hover:bg-gray-50"
          @click="emit('playerClick', player.id)"
        >
          <td class="px-6 py-4 text-sm whitespace-nowrap text-gray-800">
            {{ player.fullName }}
          </td>
          <td class="px-6 py-4 text-sm whitespace-nowrap text-gray-800">
            {{ resolveTeamName(player.teamId) }}
          </td>
          <td class="px-6 py-4 text-sm whitespace-nowrap text-gray-800">
            {{ player.position }}
          </td>
          <td class="px-6 py-4 text-sm whitespace-nowrap text-gray-800">{{ player.goals }}</td>
          <td class="px-6 py-4 text-sm whitespace-nowrap text-gray-800">{{ player.assists }}</td>
          <td class="px-6 py-4 text-sm whitespace-nowrap text-gray-800">
            {{ player.matchesPlayed }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
