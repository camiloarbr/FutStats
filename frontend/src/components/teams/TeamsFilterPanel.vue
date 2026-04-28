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
  <section
    class="flex flex-col gap-6 rounded-[1.75rem] border border-blue-500/15 bg-white p-7 shadow-[0_30px_70px_rgba(15,23,42,0.08)]"
  >
    <div>
      <p class="mb-0 text-xs font-bold uppercase tracking-[0.3em] text-blue-500">Filters</p>
      <h2 class="text-[1.35rem] font-bold text-slate-900">Refine by league and country</h2>
      <p class="max-w-[36rem] text-slate-500">
        Selections update every table and visualization instantly.
      </p>
    </div>
    <div class="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-4">
      <label class="flex flex-col gap-2">
        <span class="text-xs font-bold uppercase tracking-[0.3em] text-blue-500">League</span>
        <select
          class="rounded-2xl border border-blue-500/20 bg-white px-4 py-3 text-slate-900 outline-none"
          :value="props.selectedLeague"
          @change="emit('update:selectedLeague', ($event.target as HTMLSelectElement).value)"
        >
          <option value="">All leagues</option>
          <option v-for="option in props.leagueOptions" :key="option.value" :value="option.value">
            {{ option.label }}
          </option>
        </select>
      </label>

      <label class="flex flex-col gap-2">
        <span class="text-xs font-bold uppercase tracking-[0.3em] text-blue-500">Country</span>
        <select
          class="rounded-2xl border border-blue-500/20 bg-white px-4 py-3 text-slate-900 outline-none"
          :value="props.selectedCountry"
          @change="emit('update:selectedCountry', ($event.target as HTMLSelectElement).value)"
        >
          <option value="">All countries</option>
          <option
            v-for="option in props.countryOptions"
            :key="option.value"
            :value="option.value"
          >
            {{ option.label }}
          </option>
        </select>
      </label>
    </div>
  </section>
</template>
