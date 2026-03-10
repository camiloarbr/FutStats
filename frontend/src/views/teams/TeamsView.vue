// @author: Victor Chavez | FutStats
<script setup lang="ts">
// Chart.js typings
import type { ChartData, ChartOptions } from 'chart.js'
// Vue reactivity utilities
import { computed, ref, type Ref } from 'vue'
// Router utilities
import { useRouter } from 'vue-router'

// Reusable components
import BaseChart from '@/components/charts/BaseChart.vue'
import DataTable from '@/components/tables/DataTable.vue'
import SelectFilter from '@/components/filters/SelectFilter.vue'

// Domain services
import { TeamService } from '@/services/TeamService'

// Domain interfaces
import type { TeamInterface } from '@/interfaces/TeamInterface'

// Filter dropdown option shape
interface FilterOption {
  value: string
  label: string
}

// Data table row backing model
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

// Router instance
const router = useRouter()

// Active filters stored as refs for SelectFilter
const selectedLeague: Ref<string> = ref('')
const selectedCountry: Ref<string> = ref('')

// Teams fetched from service
const teams = computed((): TeamInterface[] => TeamService.getAll())

// Apply league and country filters
const filteredTeams = computed((): TeamInterface[] => {
  return teams.value.filter((team: TeamInterface) => {
    const matchesLeague = selectedLeague.value === '' || team.league === selectedLeague.value
    const matchesCountry = selectedCountry.value === '' || team.country === selectedCountry.value

    return matchesLeague && matchesCountry
  })
})

// Aggregate counts feeding hero metrics
const totalTeams = computed((): number => filteredTeams.value.length)

const totalLeagues = computed((): number => {
  return new Set(filteredTeams.value.map((team: TeamInterface) => team.league)).size
})

const totalCountries = computed((): number => {
  return new Set(filteredTeams.value.map((team: TeamInterface) => team.country)).size
})

// Build select options for league filter
const leagueOptions = computed((): FilterOption[] => {
  const uniqueLeagues = [...new Set(teams.value.map((team: TeamInterface) => team.league))].sort()

  return uniqueLeagues.map((league: string) => ({
    value: league,
    label: league,
  }))
})

// Build select options for country filter
const countryOptions = computed((): FilterOption[] => {
  const uniqueCountries = [...new Set(teams.value.map((team: TeamInterface) => team.country))].sort()

  return uniqueCountries.map((country: string) => ({
    value: country,
    label: country,
  }))
})

// Convert team entities into table rows
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

// Column definitions consumed by DataTable
const columns = [
  { key: 'name', label: 'Name', sortable: true },
  { key: 'country', label: 'Country', sortable: true },
  { key: 'league', label: 'League', sortable: true },
  { key: 'wins', label: 'W', sortable: true },
  { key: 'draws', label: 'D', sortable: true },
  { key: 'losses', label: 'L', sortable: true },
  { key: 'points', label: 'Points', sortable: true },
]

// Chart dataset derived from filtered teams
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

// Static chart options for the leaderboard
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

// Route to detail view when table row clicked
function handleRowClick(row: TeamTableRow): void {
  router.push({ name: 'teams.show', params: { id: row.id } })
}
</script>

<template>
  <section class="space-y-10">
    <header class="teams-hero">
      <div>
        <p class="hero-chip">Teams Intelligence</p>
        <h1>Teams Overview</h1>
        <p>Compare clubs across leagues and countries with live filters and rich tables.</p>
      </div>
      <div class="hero-metrics">
        <div>
          <span>Teams</span>
          <strong>{{ totalTeams }}</strong>
        </div>
        <div>
          <span>Leagues</span>
          <strong>{{ totalLeagues }}</strong>
        </div>
        <div>
          <span>Countries</span>
          <strong>{{ totalCountries }}</strong>
        </div>
      </div>
    </header>

    <section class="insights-grid">
      <article class="insight-card insight-card--primary">
        <div class="insight-card__icon">👥</div>
        <div>
          <p>Total Teams</p>
          <h3>{{ totalTeams }}</h3>
        </div>
        <span>Active clubs</span>
      </article>
      <article class="insight-card insight-card--neutral">
        <div class="insight-card__icon">🏆</div>
        <div>
          <p>Leagues filtered</p>
          <h3>{{ totalLeagues }}</h3>
        </div>
        <span>Realtime scope</span>
      </article>
      <article class="insight-card insight-card--dark">
        <div class="insight-card__icon">📍</div>
        <div>
          <p>Countries represented</p>
          <h3>{{ totalCountries }}</h3>
        </div>
        <span>Global spread</span>
      </article>
    </section>

    <section class="filters-panel">
      <div>
        <p class="panel-label">Filters</p>
        <h2>Refine by league and country</h2>
        <p>Selections update every table and visualization instantly.</p>
      </div>
      <div class="filters-grid">
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

    <section class="layout-grid">
      <article class="panel-card">
        <div class="panel-card__header">
          <div>
            <p class="panel-label">Roster grid</p>
            <h2>Teams Table</h2>
          </div>
          <span>{{ totalTeams }} results</span>
        </div>

        <DataTable :columns="columns" :rows="teamRows" @rowClick="handleRowClick" />
      </article>

      <article class="panel-card">
        <div class="panel-card__header">
          <div>
            <p class="panel-label">Points heat</p>
            <h2>Points per Team</h2>
          </div>
          <span>Auto refreshed</span>
        </div>

        <BaseChart
          type="bar"
          :data="chartData"
          :options="chartOptions"
          :height="420"
          :show-card="false"
        />
      </article>
    </section>
  </section>
</template>

<style scoped>
.teams-hero {
  border-radius: 2rem;
  background: linear-gradient(130deg, #0f172a, #1d4ed8, #22d3ee);
  color: #fff;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  box-shadow: 0 35px 80px rgba(15, 23, 42, 0.35);
}

@media (min-width: 768px) {
  .teams-hero {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
}

.teams-hero h1 {
  font-size: clamp(2rem, 4vw, 2.8rem);
  font-weight: 800;
  margin: 0.3rem 0;
}

.teams-hero p {
  color: rgba(255, 255, 255, 0.85);
}

.hero-chip {
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.35em;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.7);
}

.hero-metrics {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 1rem;
}

.hero-metrics span {
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.25em;
  color: rgba(255, 255, 255, 0.7);
}

.hero-metrics strong {
  display: block;
  font-size: 1.8rem;
  font-weight: 800;
}

.insights-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1.25rem;
}

.insight-card {
  border-radius: 1.5rem;
  padding: 1.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  color: #fff;
  box-shadow: 0 25px 60px rgba(15, 23, 42, 0.2);
}

.insight-card__icon {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 1rem;
  background: rgba(255, 255, 255, 0.2);
  display: grid;
  place-items: center;
  font-size: 1.25rem;
}

.insight-card p {
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.2em;
}

.insight-card h3 {
  font-size: 2.2rem;
  font-weight: 800;
}

.insight-card span {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.8);
}

.insight-card--primary {
  background: linear-gradient(130deg, #2563eb, #38bdf8);
}

.insight-card--neutral {
  background: linear-gradient(130deg, #ecfeff, #e0f2fe);
  color: #0f172a;
  box-shadow: 0 20px 50px rgba(14, 165, 233, 0.2);
}

.insight-card--neutral .insight-card__icon {
  background: rgba(15, 23, 42, 0.08);
}

.insight-card--neutral span {
  color: #334155;
}

.insight-card--dark {
  background: linear-gradient(130deg, #0f172a, #1e293b);
}

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

.panel-label {
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.35em;
  color: #3b82f6;
  margin-bottom: 0.4rem;
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

.layout-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
}

.panel-card {
  border-radius: 1.75rem;
  background: #fff;
  border: 1px solid rgba(15, 23, 42, 0.07);
  padding: 1.5rem;
  box-shadow: 0 35px 80px rgba(15, 23, 42, 0.1);
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.panel-card__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.panel-card__header h2 {
  font-size: 1.3rem;
  font-weight: 700;
  color: #0f172a;
}

.panel-card__header span {
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  color: #94a3b8;
}
</style>