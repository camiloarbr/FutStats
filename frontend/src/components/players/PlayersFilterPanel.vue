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
  <div class="filters-panel">
    <label class="filter-field">
      <span>Team</span>
      <select
        :value="props.selectedTeamId"
        @change="emit('update:selectedTeamId', ($event.target as HTMLSelectElement).value)"
      >
        <option value="">All teams</option>
        <option v-for="option in props.teamOptions" :key="option.value" :value="option.value">
          {{ option.label }}
        </option>
      </select>
    </label>

    <label class="filter-field">
      <span>Position</span>
      <select
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

<style scoped>
.filters-panel {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 1.25rem;
  border-radius: 1.75rem;
  border: 1px solid rgba(59, 130, 246, 0.15);
  background: #fff;
  padding: 1.5rem;
  box-shadow: 0 25px 60px rgba(15, 23, 42, 0.08);
}

.filter-field {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.filter-field span {
  color: #2563eb;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.3em;
  text-transform: uppercase;
}

.filter-field select {
  border-radius: 1rem;
  border: 1px solid rgba(37, 99, 235, 0.18);
  background: #fff;
  color: #0f172a;
  padding: 0.75rem 1rem;
  outline: none;
}
</style>
