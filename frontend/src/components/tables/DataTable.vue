// @author: Camilo | FutStats
<script setup lang="ts">
import { computed, ref } from 'vue'
import type {
  DataTableColumnInterface,
  DataTableRowInterface,
} from '@/interfaces/DataTableInterface'

interface Props {
  columns: DataTableColumnInterface[]
  rows: DataTableRowInterface[]
  onEdit?: (row: DataTableRowInterface) => void
  onDelete?: (row: DataTableRowInterface) => void
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'rowClick', row: DataTableRowInterface): void
}>()

const sortKey = ref<string>('')
const sortOrder = ref<'asc' | 'desc'>('asc')

function handleSort(key: string): void {
  if (sortKey.value === key) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortKey.value = key
    sortOrder.value = 'asc'
  }
}

const sortedRows = computed((): DataTableRowInterface[] => {
  if (!sortKey.value) return props.rows
  return [...props.rows].sort((a, b) => {
    const aVal = a[sortKey.value]
    const bVal = b[sortKey.value]
    if (aVal == null || bVal == null) return 0
    if (aVal < bVal) return sortOrder.value === 'asc' ? -1 : 1
    if (aVal > bVal) return sortOrder.value === 'asc' ? 1 : -1
    return 0
  })
})

function getCellValue(row: DataTableRowInterface, key: string): string | number {
  return row[key] ?? ''
}
</script>

<template>
  <div class="w-full overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
    <!-- empty state -->
    <div v-if="props.rows.length === 0" class="text-center py-12 text-gray-400 text-sm">
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
          <th
            v-if="props.onEdit || props.onDelete"
            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
          >
            Actions
          </th>
        </tr>
      </thead>
      <!-- body -->
      <tbody class="bg-white divide-y divide-gray-200">
        <tr
          v-for="row in sortedRows"
          :key="row.id"
          class="hover:bg-gray-50 cursor-pointer transition-colors"
          @click="emit('rowClick', row)"
        >
          <td
            v-for="column in props.columns"
            :key="column.key"
            class="px-6 py-4 whitespace-nowrap text-sm text-gray-800"
          >
            {{ getCellValue(row, column.key) }}
          </td>
          <td
            v-if="props.onEdit || props.onDelete"
            class="px-6 py-4 whitespace-nowrap text-sm text-gray-800"
          >
            <div class="flex items-center gap-3">
              <button
                v-if="props.onEdit"
                type="button"
                class="text-blue-600 hover:underline text-sm font-medium"
                @click.stop="props.onEdit(row)"
              >
                Edit
              </button>
              <button
                v-if="props.onDelete"
                type="button"
                class="text-red-500 hover:underline text-sm font-medium"
                @click.stop="props.onDelete(row)"
              >
                Delete
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
