<!-- @author: Samuel | FutStats -->
<script setup lang="ts">
import { computed, ref, type Ref } from 'vue'
import { useRouter } from 'vue-router'
import type { ChartData, ChartOptions } from 'chart.js'
import SelectFilter from '@/components/filters/SelectFilter.vue'
import DataTable from '@/components/tables/DataTable.vue'
import BaseChart from '@/components/charts/BaseChart.vue'
import { TeamService } from '@/services/TeamService'
import type { TeamInterface } from '@/interfaces/TeamInterface'

interface FilterOption {
  value: string
  label: string
}

interface TeamTableRow {
  id: number
  name: string
  country: string
  league: string
  wins: number
  draws: number
  losses: number
  points: number
}

const router = useRouter()

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
  const uniqueCountries = [...new Set(teams.value.map((team: TeamInterface) => team.country))].sort()

  return uniqueCountries.map((country: string) => ({
    value: country,
    label: country,
  }))
})

const teamRows = computed((): TeamTableRow[] => {
  return filteredTeams.value.map((team: TeamInterface) => ({
    id: team.id,
    name: team.name,
    country: team.country,
    league: team.league,
    wins: team.wins,
    draws: team.draws,
    losses: team.losses,
    points: team.points,
  }))
})

const columns = [
  { key: 'name', label: 'Name', sortable: true },
  { key: 'country', label: 'Country', sortable: true },
  { key: 'league', label: 'League', sortable: true },
  { key: 'wins', label: 'W', sortable: true },
  { key: 'draws', label: 'D', sortable: true },
  { key: 'losses', label: 'L', sortable: true },
  { key: 'points', label: 'Points', sortable: true },
]

const chartData = computed((): ChartData<'bar'> => {
  return {
    labels: filteredTeams.value.map((team: TeamInterface) => team.name),
    datasets: [
      {
        label: 'Points',
        data: filteredTeams.value.map((team: TeamInterface) => team.points),
        backgroundColor: ['#1b69ff', '#3d82ff', '#5b96ff', '#7baeff', '#9ac4ff', '#bfdcff'],
        borderRadius: 8,
        borderSkipped: false,
        barThickness: 32,
      },
    ],
  }
})

const chartOptions: ChartOptions<'bar'> = {
  indexAxis: 'y',
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      backgroundColor: '#0d1525',
      titleColor: '#ffffff',
      bodyColor: '#ffffff',
      displayColors: false,
    },
  },
  scales: {
    x: {
      beginAtZero: true,
      grid: {
        color: '#e5e7eb',
      },
      ticks: {
        precision: 0,
        color: '#64748b',
        font: {
          size: 12,
          weight: 600,
        },
      },
    },
    y: {
      grid: {
        display: false,
      },
      ticks: {
        color: '#64748b',
        font: {
          size: 12,
          weight: 600,
        },
      },
    },
  },
}

function handleRowClick(row: TeamTableRow): void {
  router.push({ name: 'teams.show', params: { id: row.id } })
}
</script>

<template>
  <section class="w-full bg-[#f4f7fa] px-6 py-8 md:px-10">
    <div class="mx-auto w-full max-w-7xl">
      <section class="mb-8">
        <div class="flex flex-col gap-1">
          <h1 class="text-3xl font-extrabold tracking-tight text-slate-900">Teams</h1>
          <p class="text-slate-500">
            Compare team performance across leagues and countries.
          </p>
        </div>
      </section>

      <section class="mb-10 grid grid-cols-1 gap-6 md:grid-cols-3">
        <article
          class="flex flex-col justify-between rounded-xl bg-[#1b69ff] p-6 text-white shadow-lg shadow-blue-500/30 transition-transform duration-300 hover:scale-[1.02]"
        >
          <div class="flex items-start justify-between">
            <div class="rounded-lg bg-white/20 p-2">
              <span class="text-lg">👥</span>
            </div>
            <span class="rounded bg-white/20 px-2 py-1 text-xs font-bold uppercase tracking-wider">
              Active
            </span>
          </div>

          <div class="mt-4">
            <p class="text-sm font-medium text-white/80">Total Teams</p>
            <h3 class="mt-1 text-4xl font-black">{{ totalTeams }}</h3>
          </div>
        </article>

        <article
          class="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-transform duration-300 hover:scale-[1.02]"
        >
          <div class="flex items-start justify-between">
            <div class="rounded-lg bg-[#1b69ff]/10 p-2 text-[#1b69ff]">
              <span class="text-lg">🏆</span>
            </div>
            <span
              class="rounded bg-emerald-50 px-2 py-1 text-xs font-bold uppercase tracking-wider text-emerald-500"
            >
              Filtered
            </span>
          </div>

          <div class="mt-4 text-slate-900">
            <p class="text-sm font-medium text-slate-500">Leagues</p>
            <h3 class="mt-1 text-4xl font-black">{{ totalLeagues }}</h3>
          </div>
        </article>

        <article
          class="flex flex-col justify-between rounded-xl bg-[#0d1525] p-6 text-white shadow-sm transition-transform duration-300 hover:scale-[1.02]"
        >
          <div class="flex items-start justify-between">
            <div class="rounded-lg bg-white/10 p-2 text-white">
              <span class="text-lg">📍</span>
            </div>
            <span
              class="rounded bg-[#1b69ff]/10 px-2 py-1 text-xs font-bold uppercase tracking-wider text-[#1b69ff]"
            >
              Global
            </span>
          </div>

          <div class="mt-4">
            <p class="text-sm font-medium text-slate-400">Countries</p>
            <h3 class="mt-1 text-4xl font-black">{{ totalCountries }}</h3>
          </div>
        </article>
      </section>

      <section class="mb-10 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div class="mb-4">
          <h2 class="text-lg font-bold text-slate-900">Filters</h2>
          <p class="text-sm text-slate-500">
            Narrow down teams by league and country in real time.
          </p>
        </div>

        <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
          <SelectFilter
            v-model="selectedLeague"
            label="League"
            placeholder="All leagues"
            :options="leagueOptions"
          />

          <SelectFilter
            v-model="selectedCountry"
            label="Country"
            placeholder="All countries"
            :options="countryOptions"
          />
        </div>
      </section>

      <section class="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <article
          class="flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"
        >
          <div class="border-b border-slate-100 p-6">
            <h2 class="text-lg font-bold text-slate-900">Teams Table</h2>
            <p class="text-sm text-slate-500">
              Filterable list of all teams with league and country comparison.
            </p>
          </div>

          <DataTable
            :columns="columns"
            :rows="teamRows"
            @rowClick="handleRowClick"
          />
        </article>

        <article class="flex flex-col rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div class="mb-6">
            <h2 class="text-lg font-bold text-slate-900">Points per Team</h2>
            <p class="text-sm text-slate-500">
              Current points comparison across filtered teams.
            </p>
          </div>

          <BaseChart
            type="bar"
            :data="chartData"
            :options="chartOptions"
            heightClass="h-[420px]"
          />
        </article>
      </section>
    </div>
  </section>
</template>