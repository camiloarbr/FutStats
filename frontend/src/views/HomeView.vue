// @author: Victor Chavez | FutStats
<script setup lang="ts">
import { computed } from 'vue'
import type { ChartData, ChartOptions } from 'chart.js'
import BaseChart from '@/components/charts/BaseChart.vue'
import { TeamService } from '@/services/TeamService'
import { PlayerService } from '@/services/PlayerService'
import { MatchService } from '@/services/MatchService'
import { useAuthStore } from '@/stores/useAuthStore'

const authStore = useAuthStore()

const username = computed((): string => authStore.currentUser?.username ?? 'User')

const totalTeams = computed((): number => TeamService.getAll().length)
const totalPlayers = computed((): number => PlayerService.getAll().length)
const totalMatches = computed((): number => MatchService.getAll().length)

const topScorers = computed(() => PlayerService.getTopScorers())

const teamsByGoals = computed(() => {
  return [...TeamService.getAll()]
    .sort((firstTeam, secondTeam) => secondTeam.goalsFor - firstTeam.goalsFor)
    .slice(0, 6)
})

const goalsChartData = computed((): ChartData<'bar'> => {
  return {
    labels: teamsByGoals.value.map((team) => team.name),
    datasets: [
      {
        label: 'Goals',
        data: teamsByGoals.value.map((team) => team.goalsFor),
        backgroundColor: ['#1b69ff', '#3d82ff', '#5b96ff', '#7baeff', '#9ac4ff', '#bfdcff'],
        borderRadius: 8,
        borderSkipped: false,
        barThickness: 22,
      },
    ],
  }
})

const goalsChartOptions: ChartOptions<'bar'> = {
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
</script>

<template>
  <section class="space-y-10">
    <header class="dashboard-hero">
      <div class="hero-copy">
        <p class="hero-chip">Season Pulse</p>
        <h1>Welcome back, {{ username }}</h1>
        <p>
          Track everything happening across FutStats with live scorers, trends, and key roster
          metrics.
        </p>
      </div>
      <div class="hero-metrics">
        <div>
          <span>Teams</span>
          <strong>{{ totalTeams }}</strong>
        </div>
        <div>
          <span>Players</span>
          <strong>{{ totalPlayers }}</strong>
        </div>
        <div>
          <span>Matches</span>
          <strong>{{ totalMatches }}</strong>
        </div>
      </div>
    </header>

    <section class="stats-grid">
      <article class="stat-card stat-card--primary">
        <div class="stat-card__icon">👥</div>
        <div>
          <p>Tracked Teams</p>
          <h3>{{ totalTeams }}</h3>
        </div>
        <span>Active roster</span>
      </article>

      <article class="stat-card stat-card--neutral">
        <div class="stat-card__icon">👤</div>
        <div>
          <p>Registered Players</p>
          <h3>{{ totalPlayers }}</h3>
        </div>
        <span>Updated daily</span>
      </article>

      <article class="stat-card stat-card--dark">
        <div class="stat-card__icon">⚽</div>
        <div>
          <p>Total Matches</p>
          <h3>{{ totalMatches }}</h3>
        </div>
        <span>Season 23/24</span>
      </article>
    </section>

    <section class="panel-grid">
      <article class="panel-card">
        <div class="panel-card__header">
          <div>
            <p class="panel-label">Leaderboard</p>
            <h2>Top 5 Scorers</h2>
          </div>
          <span>Live ranking</span>
        </div>

        <div class="table-scroll">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Team</th>
                <th class="text-center">Goals</th>
                <th class="text-center">Assists</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="player in topScorers" :key="player.name">
                <td>
                  <div class="player-cell">
                    <span class="player-chip" :class="player.initialsClass">
                      {{ player.initials }}
                    </span>
                    {{ player.name }}
                  </div>
                </td>
                <td>{{ player.team }}</td>
                <td class="text-center text-indigo-500">{{ player.goals }}</td>
                <td class="text-center text-slate-500">{{ player.assists }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </article>

      <article class="panel-card">
        <div class="panel-card__header">
          <div>
            <p class="panel-label">Momentum</p>
            <h2>Goals per Team</h2>
          </div>
          <span>Updated automatically</span>
        </div>

        <BaseChart
          type="bar"
          :data="goalsChartData"
          :options="goalsChartOptions"
          :height="420"
          :show-card="false"
        />
      </article>
    </section>
  </section>
</template>

<style scoped>
.dashboard-hero {
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
  .dashboard-hero {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
}

.hero-copy h1 {
  font-size: clamp(2rem, 4vw, 2.8rem);
  font-weight: 800;
  margin-bottom: 0.35rem;
}

.hero-copy p {
  color: rgba(255, 255, 255, 0.85);
  max-width: 32rem;
}

.hero-chip {
  font-size: 0.75rem;
  letter-spacing: 0.35em;
  text-transform: uppercase;
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

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1.25rem;
}

.stat-card {
  border-radius: 1.5rem;
  padding: 1.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  position: relative;
  overflow: hidden;
  color: #fff;
  box-shadow: 0 25px 60px rgba(15, 23, 42, 0.2);
}

.stat-card__icon {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 1rem;
  background: rgba(255, 255, 255, 0.2);
  display: grid;
  place-items: center;
  font-size: 1.25rem;
}

.stat-card p {
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.2em;
}

.stat-card h3 {
  font-size: 2.2rem;
  font-weight: 800;
}

.stat-card span {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.8);
}

.stat-card--primary {
  background: linear-gradient(130deg, #2563eb, #38bdf8);
}

.stat-card--neutral {
  background: linear-gradient(130deg, #ecfeff, #e0f2fe);
  color: #0f172a;
  box-shadow: 0 20px 50px rgba(14, 165, 233, 0.2);
}

.stat-card--neutral .stat-card__icon {
  background: rgba(15, 23, 42, 0.08);
}

.stat-card--neutral span {
  color: #334155;
}

.stat-card--dark {
  background: linear-gradient(130deg, #0f172a, #1e293b);
}

.panel-grid {
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
  gap: 1.25rem;
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

.panel-label {
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.35em;
  color: #3b82f6;
  margin-bottom: 0.2rem;
}

.table-scroll {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
}

thead {
  background: #f1f5f9;
}

th,
td {
  padding: 0.85rem 1rem;
  text-align: left;
  font-size: 0.9rem;
}

tbody tr {
  border-bottom: 1px solid rgba(148, 163, 184, 0.2);
  transition: background 0.2s ease;
}

tbody tr:hover {
  background: rgba(15, 23, 42, 0.02);
}

.player-cell {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-weight: 600;
  color: #0f172a;
}

.player-chip {
  width: 2.25rem;
  height: 2.25rem;
  border-radius: 999px;
  display: grid;
  place-items: center;
  font-size: 0.8rem;
  font-weight: 700;
}
</style>