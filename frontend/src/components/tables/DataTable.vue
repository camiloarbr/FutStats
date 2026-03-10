// @author: [Name] | FutStats
<script setup lang="ts" generic="T">
// Vue reactivity utilities
import { computed, ref } from 'vue'

// Column metadata contract
interface Column {
  key: string
  label: string
  sortable?: boolean
}

// Component props
interface Props<T> {
  columns: Column[]
  rows: T[]
}

// Props and emits
const props = defineProps<Props<T>>()
const emit = defineEmits<{
  (e: 'rowClick', row: T): void
}>()

// Sort state
const sortKey = ref<string>('')
const sortOrder = ref<'asc' | 'desc'>('asc')

// Handle sort column click
function handleSort(key: string): void {
  if (sortKey.value === key) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortKey.value = key
    sortOrder.value = 'asc'
  }
}

// Sorted rows computed
const sortedRows = computed((): T[] => {
  if (!sortKey.value) return props.rows
  return [...props.rows].sort((a, b) => {
    const aVal = (a as Record<string, unknown>)[sortKey.value]
    const bVal = (b as Record<string, unknown>)[sortKey.value]
    if (aVal == null || bVal == null) return 0
    if (aVal < bVal) return sortOrder.value === 'asc' ? -1 : 1
    if (aVal > bVal) return sortOrder.value === 'asc' ? 1 : -1
    return 0
  })
})
</script>

<template>
  <div class="w-full overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
    <!-- empty state -->
    <div
      v-if="props.rows.length === 0"
      class="text-center py-12 text-gray-400 text-sm"
    >
      <i class="fas fa-inbox text-3xl mb-3 block"></i>
      No data available
    </div>

    <!-- table -->
    <table v-else class="w-full">
      <!-- header -->
      <thead class="bg-gray-50 border-b border-gray-200">
        <tr>
          <th
            v-for="column in props.columns"
            :key="column.key"
            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            :class="{ 'cursor-pointer hover:bg-gray-100': column.sortable }"
            @click="column.sortable ? handleSort(column.key) : undefined"
          >
            <div class="flex items-center gap-2">
              <span>{{ column.label }}</span>
              <span v-if="column.sortable && sortKey === column.key" class="text-blue-500">
                <i v-if="sortOrder === 'asc'" class="fas fa-sort-up"></i>
                <i v-else class="fas fa-sort-down"></i>
              </span>
            </div>
          </th>
        </tr>
      </thead>
      <!-- body -->
      <tbody class="bg-white divide-y divide-gray-200">
        <tr
          v-for="(row, index) in sortedRows"
          :key="index"
          class="hover:bg-gray-50 cursor-pointer transition-colors"
          @click="emit('rowClick', row)"
        >
          <td
            v-for="column in props.columns"
            :key="column.key"
            class="px-6 py-4 whitespace-nowrap text-sm text-gray-800"
          >
            {{ (row as Record<string, unknown>)[column.key] }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
