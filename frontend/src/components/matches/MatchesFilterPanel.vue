// @author: Victor Chavez | FutStats
<script setup lang="ts">
import SelectFilter from '@/components/filters/SelectFilter.vue'

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

function handleUpdate(value: string): void {
  emit('update:modelValue', value)
}
</script>

<template>
  <div class="filter-panel">
    <div class="filter-panel__copy">
      <p class="filter-chip">Filters</p>
      <h3>Focus on a single club</h3>
      <p>Compare league-wide momentum or zoom into one team to inspect their match streak.</p>
    </div>
    <div class="filter-panel__control">
      <SelectFilter
        :model-value="props.modelValue"
        label="Team"
        :options="props.options"
        placeholder="All teams"
        @update:model-value="handleUpdate"
      />
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
</style>
