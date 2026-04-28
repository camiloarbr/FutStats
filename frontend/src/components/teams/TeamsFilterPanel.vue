// @author: Victor Chavez | FutStats
<script setup lang="ts">
interface FilterOption {
  value: string
  label: string
}

interface Props {
  selectedLeague: string
  selectedCountry: string
  leagueOptions: FilterOption[]
  countryOptions: FilterOption[]
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (event: 'update:selectedLeague', value: string): void
  (event: 'update:selectedCountry', value: string): void
}>()
</script>

<template>
  <section class="filters-panel">
    <div>
      <p class="panel-label">Filters</p>
      <h2>Refine by league and country</h2>
      <p>Selections update every table and visualization instantly.</p>
    </div>
    <div class="filters-grid">
      <label class="filter-field">
        <span>League</span>
        <select
          :value="props.selectedLeague"
          @change="emit('update:selectedLeague', ($event.target as HTMLSelectElement).value)"
        >
          <option value="">All leagues</option>
          <option v-for="option in props.leagueOptions" :key="option.value" :value="option.value">
            {{ option.label }}
          </option>
        </select>
      </label>

      <label class="filter-field">
        <span>Country</span>
        <select
          :value="props.selectedCountry"
          @change="emit('update:selectedCountry', ($event.target as HTMLSelectElement).value)"
        >
          <option value="">All countries</option>
          <option v-for="option in props.countryOptions" :key="option.value" :value="option.value">
            {{ option.label }}
          </option>
        </select>
      </label>
    </div>
  </section>
</template>

<style scoped>
.filters-panel {
  border-radius: 1.75rem;
  border: 1px solid rgba(59, 130, 246, 0.15);
  background: #fff;
  padding: 1.75rem;
  box-shadow: 0 30px 70px rgba(15, 23, 42, 0.08);
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.filters-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1rem;
}

.filter-field {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.filter-field span,
.panel-label {
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.3em;
  color: #3b82f6;
  font-weight: 700;
}

.filter-field select {
  border-radius: 1rem;
  border: 1px solid rgba(59, 130, 246, 0.2);
  background: #fff;
  color: #0f172a;
  padding: 0.75rem 1rem;
  outline: none;
}

.filters-panel h2 {
  font-size: 1.35rem;
  font-weight: 700;
  color: #0f172a;
}

.filters-panel p {
  color: #64748b;
  max-width: 36rem;
}
</style>
