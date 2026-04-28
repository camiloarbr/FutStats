// @author: Victor Chavez | FutStats
<script setup lang="ts">
// 1. External imports
import { computed, ref, type Ref } from 'vue'
import { useRouter } from 'vue-router'

// 2. Internal imports
import TeamPointsChart from '@/components/teams/TeamPointsChart.vue'
import TeamsFilterPanel from '@/components/teams/TeamsFilterPanel.vue'
import TeamsTable from '@/components/teams/TeamsTable.vue'
import DataStateBanner from '@/components/ui/DataStateBanner.vue'
import type { TeamInterface } from '@/interfaces/TeamInterface'
import { FutStatsDataService } from '@/services/FutStatsDataService'
import { TeamService } from '@/services/TeamService'
import { useDataStatusStore } from '@/stores/useDataStatusStore'

interface FilterOption {
  value: string
  label: string
}

const router = useRouter()
const dataStatusStore = useDataStatusStore()

const selectedLeague: Ref<string> = ref('')
const selectedCountry: Ref<string> = ref('')

const teams = computed((): TeamInterface[] => TeamService.getAll())

const filteredTeams = computed((): TeamInterface[] => {
  return teams.value.filter((team: TeamInterface) => {
    const matchesLeague = selectedLeague.value === '' || team.league === selectedLeague.value
    const matchesCountry = selectedCountry.value === '' || team.country === selectedCountry.value

    return matchesLeague && matchesCountry
  })
})

const totalTeams = computed((): number => filteredTeams.value.length)

const totalLeagues = computed((): number => {
  return new Set(filteredTeams.value.map((team: TeamInterface) => team.league)).size
})

const totalCountries = computed((): number => {
  return new Set(filteredTeams.value.map((team: TeamInterface) => team.country)).size
})

const leagueOptions = computed((): FilterOption[] => {
  const uniqueLeagues = [...new Set(teams.value.map((team: TeamInterface) => team.league))].sort()

  return uniqueLeagues.map((league: string) => ({
    value: league,
    label: league,
  }))
})

const countryOptions = computed((): FilterOption[] => {
  const uniqueCountries = [
    ...new Set(teams.value.map((team: TeamInterface) => team.country)),
  ].sort()

  return uniqueCountries.map((country: string) => ({
    value: country,
    label: country,
  }))
})

function handleTeamClick(id: number): void {
  router.push({ name: 'teams.show', params: { id } })
}

function reloadData(): void {
  void FutStatsDataService.loadInitialData()
}
</script>

<template>
  <section class="space-y-10">
    <header
      class="flex flex-col gap-6 rounded-[2rem] bg-gradient-to-br from-[#0f172a] via-[#1d4ed8] to-[#22d3ee] p-8 text-white shadow-[0_35px_80px_rgba(15,23,42,0.35)] md:flex-row md:items-center md:justify-between"
    >
      <div>
        <p class="text-[0.75rem] font-bold uppercase tracking-[0.35em] text-white/70">
          Teams Intelligence
        </p>
        <h1 class="my-[0.3rem] text-[clamp(2rem,4vw,2.8rem)] font-extrabold">Teams Overview</h1>
        <p class="text-white/85">
          Compare clubs across leagues and countries with live filters and rich tables.
        </p>
      </div>
      <div class="grid grid-cols-[repeat(auto-fit,minmax(120px,1fr))] gap-4">
        <div>
          <span class="text-[0.75rem] uppercase tracking-[0.25em] text-white/70">Teams</span>
          <strong class="block text-[1.8rem] font-extrabold">{{ totalTeams }}</strong>
        </div>
        <div>
          <span class="text-[0.75rem] uppercase tracking-[0.25em] text-white/70">Leagues</span>
          <strong class="block text-[1.8rem] font-extrabold">{{ totalLeagues }}</strong>
        </div>
        <div>
          <span class="text-[0.75rem] uppercase tracking-[0.25em] text-white/70">Countries</span>
          <strong class="block text-[1.8rem] font-extrabold">{{ totalCountries }}</strong>
        </div>
      </div>
    </header>

    <DataStateBanner
      :error-message="dataStatusStore.errorMessage"
      :is-loading="dataStatusStore.isLoading"
      @retry="reloadData"
    />

    <section class="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-5">
      <article
        class="flex flex-col gap-[0.4rem] overflow-hidden rounded-3xl bg-gradient-to-br from-[#2563eb] to-[#38bdf8] p-7 text-white shadow-[0_25px_60px_rgba(15,23,42,0.2)]"
      >
        <div class="grid h-10 w-10 place-items-center rounded-2xl bg-white/20 text-[1.25rem]">
          👥
        </div>
        <div>
          <p class="text-[0.85rem] uppercase tracking-[0.2em]">Total Teams</p>
          <h3 class="text-[2.2rem] font-extrabold">{{ totalTeams }}</h3>
        </div>
        <span class="text-[0.9rem] text-white/80">Active clubs</span>
      </article>

      <article
        class="flex flex-col gap-[0.4rem] overflow-hidden rounded-3xl bg-gradient-to-br from-[#ecfeff] to-[#e0f2fe] p-7 text-slate-900 shadow-[0_20px_50px_rgba(14,165,233,0.2)]"
      >
        <div
          class="grid h-10 w-10 place-items-center rounded-2xl bg-slate-900/[0.08] text-[1.25rem]"
        >
          🏆
        </div>
        <div>
          <p class="text-[0.85rem] uppercase tracking-[0.2em]">Leagues filtered</p>
          <h3 class="text-[2.2rem] font-extrabold">{{ totalLeagues }}</h3>
        </div>
        <span class="text-[0.9rem] text-slate-700">Realtime scope</span>
      </article>

      <article
        class="flex flex-col gap-[0.4rem] overflow-hidden rounded-3xl bg-gradient-to-br from-[#0f172a] to-[#1e293b] p-7 text-white shadow-[0_25px_60px_rgba(15,23,42,0.2)]"
      >
        <div class="grid h-10 w-10 place-items-center rounded-2xl bg-white/20 text-[1.25rem]">
          📍
        </div>
        <div>
          <p class="text-[0.85rem] uppercase tracking-[0.2em]">Countries represented</p>
          <h3 class="text-[2.2rem] font-extrabold">{{ totalCountries }}</h3>
        </div>
        <span class="text-[0.9rem] text-white/80">Global spread</span>
      </article>
    </section>

    <TeamsFilterPanel
      v-model:selected-league="selectedLeague"
      v-model:selected-country="selectedCountry"
      :league-options="leagueOptions"
      :country-options="countryOptions"
    />

    <section class="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-6">
      <article
        class="flex flex-col gap-4 rounded-[1.75rem] border border-slate-900/[0.07] bg-white p-6 shadow-[0_35px_80px_rgba(15,23,42,0.1)]"
      >
        <div class="flex items-center justify-between">
          <div>
            <p class="mb-[0.4rem] text-[0.75rem] uppercase tracking-[0.35em] text-blue-500">
              Roster grid
            </p>
            <h2 class="text-[1.3rem] font-bold text-slate-900">Teams Table</h2>
          </div>
          <span class="text-[0.8rem] uppercase tracking-[0.2em] text-slate-400"
            >{{ totalTeams }} results</span
          >
        </div>

        <TeamsTable :teams="filteredTeams" @team-click="handleTeamClick" />
      </article>

      <article
        class="flex flex-col gap-4 rounded-[1.75rem] border border-slate-900/[0.07] bg-white p-6 shadow-[0_35px_80px_rgba(15,23,42,0.1)]"
      >
        <div class="flex items-center justify-between">
          <div>
            <p class="mb-[0.4rem] text-[0.75rem] uppercase tracking-[0.35em] text-blue-500">
              Points heat
            </p>
            <h2 class="text-[1.3rem] font-bold text-slate-900">Points per Team</h2>
          </div>
          <span class="text-[0.8rem] uppercase tracking-[0.2em] text-slate-400"
            >Auto refreshed</span
          >
        </div>

        <TeamPointsChart :teams="filteredTeams" />
      </article>
    </section>
  </section>
</template>
