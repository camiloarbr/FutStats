// @author: Victor Chavez | FutStats
<script setup lang="ts">
import { computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { ChartData, ChartOptions, TooltipItem } from 'chart.js'

import BaseChart from '@/components/charts/BaseChart.vue'

import { PlayerService } from '@/services/PlayerService'
import { TeamService } from '@/services/TeamService'

import type { PlayerInterface } from '@/interfaces/PlayerInterface'
import type { TeamInterface } from '@/interfaces/TeamInterface'

const route = useRoute()
const router = useRouter()

const playerId = computed<number>(() => Number(route.params.id))
const playersCollection = computed<PlayerInterface[]>(() => PlayerService.getAll())

const player = computed<PlayerInterface | undefined>(() => {
  if (!Number.isFinite(playerId.value)) {
    return undefined
  }
  return PlayerService.getById(playerId.value)
})

const playersReady = computed<boolean>(() => playersCollection.value.length > 0)

const team = computed<TeamInterface | undefined>(() => {
  if (!player.value) {
    return undefined
  }
  return TeamService.getById(player.value.teamId)
})

const playerImage = computed<string>(() => player.value?.imageUrl || 'https://placehold.co/320x320?text=Player')

const spotlightStats = computed(() => {
  if (!player.value) {
    return []
  }

  return [
    {
      id: 'goals',
      label: 'Goals',
      value: player.value.goals,
      helper: 'Season total',
      accent: 'from-blue-600 to-sky-500',
    },
    {
      id: 'assists',
      label: 'Assists',
      value: player.value.assists,
      helper: 'Final passes delivered',
      accent: 'from-sky-500 to-cyan-400',
    },
    {
      id: 'matches',
      label: 'Matches',
      value: player.value.matchesPlayed,
      helper: 'Appearances logged',
      accent: 'from-indigo-600 to-blue-500',
    },
  ]
})

const extendedStats = computed(() => {
  if (!player.value) {
    return []
  }

  return [
    { id: 'shots', label: 'Shots', value: player.value.shots },
    { id: 'passes', label: 'Passes', value: player.value.passes },
    { id: 'minutes', label: 'Minutes Played', value: player.value.minutesPlayed },
    { id: 'yellow', label: 'Yellow Cards', value: player.value.yellowCards },
    { id: 'red', label: 'Red Cards', value: player.value.redCards },
  ]
})

const performanceChartData = computed<ChartData<'bar'>>(() => {
  if (!player.value) {
    return { labels: [], datasets: [] }
  }

  return {
    labels: ['Goals', 'Assists', 'Shots', 'Passes'],
    datasets: [
      {
        label: player.value.fullName,
        data: [player.value.goals, player.value.assists, player.value.shots, player.value.passes],
        backgroundColor: ['#2563eb', '#22d3ee', '#0ea5e9', '#38bdf8'],
        borderRadius: 12,
        borderSkipped: false,
      },
    ],
  }
})

const performanceChartOptions = computed<ChartOptions<'bar'>>(() => ({
  maintainAspectRatio: false,
  responsive: true,
  plugins: {
    legend: { display: false },
    tooltip: {
      callbacks: {
        label(context: TooltipItem<'bar'>) {
          const value = context.parsed.y ?? 0
          return `${value} ${context.label.toLowerCase()}`
        },
      },
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: { precision: 0 },
    },
  },
}))

watch(
  () => ({ player: player.value, ready: playersReady.value }),
  ({ player: currentPlayer, ready }) => {
    if (!ready) {
      return
    }

    if (!currentPlayer) {
      router.replace({ name: 'players.index' })
      return
    }

    document.title = `FutStats | ${currentPlayer.fullName}`
  },
  { immediate: true },
)
</script>

<template>
  <section v-if="player" class="space-y-8">
    <article class="player-hero">
      <div class="player-hero__content">
        <p class="hero-chip">Player Profile</p>
        <h1>{{ player.fullName }}</h1>
        <p>
          {{ player.position }} • {{ player.nationality }} • Shirt #{{ player.shirtNumber }}
        </p>
        <div class="player-meta">
          <span>Team</span>
          <strong>{{ team?.name ?? 'Free Agent' }}</strong>
        </div>
      </div>
      <div class="player-hero__image">
        <img :src="playerImage" :alt="`${player.fullName} portrait`" />
      </div>
    </article>

    <div class="stat-grid">
      <div
        v-for="stat in spotlightStats"
        :key="stat.id"
        class="stat-card"
      >
        <div class="stat-card__bg" :class="[`bg-gradient-to-br`, stat.accent]"></div>
        <div class="stat-card__content">
          <p>{{ stat.label }}</p>
          <strong>{{ stat.value }}</strong>
          <span>{{ stat.helper }}</span>
        </div>
      </div>
    </div>

    <div class="detail-grid">
      <BaseChart
        :data="performanceChartData"
        :options="performanceChartOptions"
        :height="320"
        type="bar"
        title="Attacking Output"
      />

      <div class="metrics-card">
        <h3>Match Impact</h3>
        <dl>
          <div
            v-for="metric in extendedStats"
            :key="metric.id"
            class="metric-row"
          >
            <dt>{{ metric.label }}</dt>
            <dd>{{ metric.value }}</dd>
          </div>
        </dl>
      </div>
    </div>
  </section>
  <section v-else class="missing-player">
    <p>Loading player data...</p>
  </section>
</template>

<style scoped>
.player-hero {
  border-radius: 2rem;
  padding: 2rem;
  background: linear-gradient(120deg, #0f172a, #1d4ed8, #22d3ee);
  color: #fff;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  box-shadow: 0 35px 80px rgba(15, 23, 42, 0.35);
}

@media (min-width: 768px) {
  .player-hero {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
}

.hero-chip {
  font-size: 0.75rem;
  letter-spacing: 0.35em;
  text-transform: uppercase;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.7);
}

.player-hero h1 {
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 800;
  margin-top: 0.25rem;
}

.player-hero p {
  color: rgba(255, 255, 255, 0.9);
}

.player-meta {
  margin-top: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  text-transform: uppercase;
  letter-spacing: 0.25em;
  font-size: 0.75rem;
}

.player-meta strong {
  font-size: 1.4rem;
  letter-spacing: normal;
  text-transform: none;
}

.player-hero__image {
  border-radius: 1.5rem;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.4);
  max-width: 320px;
  margin: 0 auto;
}

.player-hero__image img {
  width: 100%;
  display: block;
  object-fit: cover;
}

.stat-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 1.25rem;
}

.stat-card {
  position: relative;
  border-radius: 1.5rem;
  padding: 1.5rem;
  overflow: hidden;
  color: #fff;
  box-shadow: 0 20px 60px rgba(15, 23, 42, 0.2);
}

.stat-card__bg {
  position: absolute;
  inset: 0;
  opacity: 0.85;
}

.stat-card__content {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.stat-card__content p {
  font-size: 0.75rem;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.85);
}

.stat-card__content strong {
  font-size: 2rem;
  font-weight: 800;
}

.stat-card__content span {
  color: rgba(255, 255, 255, 0.9);
}

.detail-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
}

.metrics-card {
  border-radius: 1.5rem;
  border: 1px solid rgba(15, 23, 42, 0.07);
  background: #fff;
  padding: 1.75rem;
  box-shadow: 0 30px 70px rgba(15, 23, 42, 0.08);
}

.metrics-card h3 {
  font-size: 1.1rem;
  font-weight: 700;
  margin-bottom: 1.25rem;
}

.metrics-card dl {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.metric-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid rgba(148, 163, 184, 0.3);
  padding-bottom: 0.75rem;
}

.metric-row:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.metric-row dt {
  font-size: 0.9rem;
  color: #475569;
}

.metric-row dd {
  font-size: 1.2rem;
  font-weight: 700;
  color: #0f172a;
}

.missing-player {
  border-radius: 1.5rem;
  padding: 2rem;
  border: 1px dashed rgba(148, 163, 184, 0.5);
  text-align: center;
  color: #475569;
}
</style>
