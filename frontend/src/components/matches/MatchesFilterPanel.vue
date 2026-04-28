// @author: Victor Chavez | FutStats
<script setup lang="ts">
interface OptionItem {
  value: string
  label: string
}

const props = defineProps<{
  modelValue: string
  options: OptionItem[]
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()
</script>

<template>
  <div class="filter-panel">
    <div class="filter-panel__copy">
      <p class="filter-chip">Filters</p>
      <h3>Focus on a single club</h3>
      <p>Compare league-wide momentum or zoom into one team to inspect their match streak.</p>
    </div>
    <div class="filter-panel__control">
      <label class="team-filter">
        <span>Team</span>
        <select
          :value="props.modelValue"
          @change="emit('update:modelValue', ($event.target as HTMLSelectElement).value)"
        >
          <option value="">All teams</option>
          <option v-for="option in props.options" :key="option.value" :value="option.value">
            {{ option.label }}
          </option>
        </select>
      </label>
    </div>
  </div>
</template>

<style scoped>
.filter-panel {
  border-radius: 1.5rem;
  border: 1px solid rgba(59, 130, 246, 0.2);
  background: rgba(255, 255, 255, 0.9);
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  box-shadow: 0 25px 60px rgba(59, 130, 246, 0.12);
  backdrop-filter: blur(6px);
}

@media (min-width: 768px) {
  .filter-panel {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
}

.filter-panel__copy {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.filter-chip {
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.3em;
  font-weight: 700;
  color: #3b82f6;
}

.filter-panel__copy h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #0f172a;
}

.filter-panel__copy p {
  color: #475569;
  font-size: 0.9rem;
}

.filter-panel__control {
  width: 100%;
  max-width: 16rem;
}

.team-filter {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.team-filter span {
  color: #2563eb;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.3em;
  text-transform: uppercase;
}

.team-filter select {
  border-radius: 1rem;
  border: 1px solid rgba(37, 99, 235, 0.18);
  background: #fff;
  color: #0f172a;
  padding: 0.75rem 1rem;
  outline: none;
  width: 100%;
}
</style>
