// @author: Victor Chavez | FutStats
<script setup lang="ts">
interface FilterOption {
  value: string
  label: string
}

interface Props {
  selectedTeamId: string
  selectedPosition: string
  teamOptions: FilterOption[]
  positionOptions: FilterOption[]
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (event: 'update:selectedTeamId', value: string): void
  (event: 'update:selectedPosition', value: string): void
}>()
</script>

<template>
  <div
    class="grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-5 rounded-[1.75rem] border border-blue-500/15 bg-white p-6 shadow-[0_25px_60px_rgba(15,23,42,0.08)]"
  >
    <label class="flex flex-col gap-2">
      <span class="text-xs font-bold uppercase tracking-[0.3em] text-blue-600">Team</span>
      <select
        class="rounded-2xl border border-blue-600/20 bg-white px-4 py-3 text-slate-900 outline-none"
        :value="props.selectedTeamId"
        @change="emit('update:selectedTeamId', ($event.target as HTMLSelectElement).value)"
      >
        <option value="">All teams</option>
        <option v-for="option in props.teamOptions" :key="option.value" :value="option.value">
          {{ option.label }}
        </option>
      </select>
    </label>

    <label class="flex flex-col gap-2">
      <span class="text-xs font-bold uppercase tracking-[0.3em] text-blue-600">Position</span>
      <select
        class="rounded-2xl border border-blue-600/20 bg-white px-4 py-3 text-slate-900 outline-none"
        :value="props.selectedPosition"
        @change="emit('update:selectedPosition', ($event.target as HTMLSelectElement).value)"
      >
        <option value="">All positions</option>
        <option v-for="option in props.positionOptions" :key="option.value" :value="option.value">
          {{ option.label }}
        </option>
      </select>
    </label>
  </div>
</template>
