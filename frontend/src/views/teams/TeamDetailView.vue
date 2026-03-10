<!-- @author: Samuel | FutStats -->
<script setup lang="ts">
import { computed, watchEffect } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { ChartData, ChartOptions } from 'chart.js'
import BaseChart from '@/components/charts/BaseChart.vue'
import LeafletMap from '@/components/ui/LeafletMap.vue'
import { TeamService } from '@/services/TeamService'
import { PlayerService } from '@/services/PlayerService'
import type { TeamInterface } from '@/interfaces/TeamInterface'
import type { PlayerInterface } from '@/interfaces/PlayerInterface'

const route = useRoute()
const router = useRouter()

const teamId = computed((): number => Number(route.params.id))

const team = computed((): TeamInterface | undefined => {
  return TeamService.getById(teamId.value)
})

const teamPlayers = computed((): PlayerInterface[] => {
  if (!team.value) {
    return []
  }

  return PlayerService.getByTeam(team.value.id)
})

watchEffect((): void => {
  if (!team.value) {
    router.replace({ name: 'teams.index' })
    return
  }

  document.title = `FutStats | ${team.value.name}`
})

const seasonChartData = computed((): ChartData<'doughnut'> => {
  if (!team.value) {
    return {
      labels: ['Wins', 'Draws', 'Losses'],
      datasets: [
        {
          data: [0, 0, 0],
          backgroundColor: ['#1b69ff', '#94a3b8', '#0d1525'],
          borderWidth: 0,
        },
      ],
    }
  }

  return {
    labels: ['Wins', 'Draws', 'Losses'],
    datasets: [
      {
        data: [team.value.wins, team.value.draws, team.value.losses],
        backgroundColor: ['#1b69ff', '#94a3b8', '#0d1525'],
        borderWidth: 0,
      },
    ],
  }
})

const seasonChartOptions: ChartOptions<'doughnut'> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom',
      labels: {
        color: '#475569',
        font: {
          size: 12,
          weight: 600,
        },
        usePointStyle: true,
        padding: 16,
      },
    },
    tooltip: {
      backgroundColor: '#0d1525',
      titleColor: '#ffffff',
      bodyColor: '#ffffff',
      displayColors: true,
    },
  },
  cutout: '68%',
}
</script>

<template>
  <section v-if="team" class="w-full bg-[#f4f7fa] px-6 py-8 md:px-10">
    <div class="mx-auto w-full max-w-7xl">
      <section class="mb-8">
        <div class="flex flex-col gap-1">
          <h1 class="text-3xl font-extrabold tracking-tight text-slate-900">
            {{ team.name }}
          </h1>
          <p class="text-slate-500">
            Explore team profile, season performance, squad, and stadium location.
          </p>
        </div>
      </section>

      <section class="mb-10 grid grid-cols-1 gap-6 md:grid-cols-3">
        <article
          class="flex flex-col justify-between rounded-xl bg-[#1b69ff] p-6 text-white shadow-lg shadow-blue-500/30 transition-transform duration-300 hover:scale-[1.02]"
        >
          <div class="flex items-start justify-between">
            <div class="rounded-lg bg-white/20 p-2">
              <span class="text-lg">🏟️</span>
            </div>
            <span class="rounded bg-white/20 px-2 py-1 text-xs font-bold uppercase tracking-wider">
              Team
            </span>
          </div>

          <div class="mt-4">
            <p class="text-sm font-medium text-white/80">League</p>
            <h3 class="mt-1 text-3xl font-black">{{ team.league }}</h3>
          </div>
        </article>

        <article
          class="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-transform duration-300 hover:scale-[1.02]"
        >
          <div class="flex items-start justify-between">
            <div class="rounded-lg bg-[#1b69ff]/10 p-2 text-[#1b69ff]">
              <span class="text-lg">🌍</span>
            </div>
            <span
              class="rounded bg-emerald-50 px-2 py-1 text-xs font-bold uppercase tracking-wider text-emerald-500"
            >
              Country
            </span>
          </div>

          <div class="mt-4 text-slate-900">
            <p class="text-sm font-medium text-slate-500">Country</p>
            <h3 class="mt-1 text-3xl font-black">{{ team.country }}</h3>
          </div>
        </article>

        <article
          class="flex flex-col justify-between rounded-xl bg-[#0d1525] p-6 text-white shadow-sm transition-transform duration-300 hover:scale-[1.02]"
        >
          <div class="flex items-start justify-between">
            <div class="rounded-lg bg-white/10 p-2 text-white">
              <span class="text-lg">📅</span>
            </div>
            <span
              class="rounded bg-[#1b69ff]/10 px-2 py-1 text-xs font-bold uppercase tracking-wider text-[#1b69ff]"
            >
              Founded
            </span>
          </div>

          <div class="mt-4">
            <p class="text-sm font-medium text-slate-400">Year</p>
            <h3 class="mt-1 text-3xl font-black">{{ team.foundedYear }}</h3>
          </div>
        </article>
      </section>

      <section class="mb-10 grid grid-cols-1 gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <article class="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div class="mb-6 flex items-center gap-4">
            <img
              :src="team.imageUrl"
              :alt="team.name"
              class="h-20 w-20 rounded-xl object-cover ring-1 ring-slate-200"
            />

            <div>
              <h2 class="text-2xl font-bold text-slate-900">{{ team.name }}</h2>
              <p class="text-sm text-slate-500">{{ team.country }} · {{ team.league }}</p>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4 md:grid-cols-3">
            <div class="rounded-lg bg-slate-50 p-4">
              <p class="text-xs font-semibold uppercase tracking-wider text-slate-500">Wins</p>
              <p class="mt-2 text-2xl font-black text-slate-900">{{ team.wins }}</p>
            </div>

            <div class="rounded-lg bg-slate-50 p-4">
              <p class="text-xs font-semibold uppercase tracking-wider text-slate-500">Draws</p>
              <p class="mt-2 text-2xl font-black text-slate-900">{{ team.draws }}</p>
            </div>

            <div class="rounded-lg bg-slate-50 p-4">
              <p class="text-xs font-semibold uppercase tracking-wider text-slate-500">Losses</p>
              <p class="mt-2 text-2xl font-black text-slate-900">{{ team.losses }}</p>
            </div>

            <div class="rounded-lg bg-slate-50 p-4">
              <p class="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Goals For
              </p>
              <p class="mt-2 text-2xl font-black text-slate-900">{{ team.goalsFor }}</p>
            </div>

            <div class="rounded-lg bg-slate-50 p-4">
              <p class="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Goals Against
              </p>
              <p class="mt-2 text-2xl font-black text-slate-900">{{ team.goalsAgainst }}</p>
            </div>

            <div class="rounded-lg bg-slate-50 p-4">
              <p class="text-xs font-semibold uppercase tracking-wider text-slate-500">Points</p>
              <p class="mt-2 text-2xl font-black text-[#1b69ff]">{{ team.points }}</p>
            </div>
          </div>
        </article>

        <article class="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div class="mb-6">
            <h2 class="text-lg font-bold text-slate-900">Season Distribution</h2>
            <p class="text-sm text-slate-500">Wins, draws, and losses breakdown.</p>
          </div>

          <BaseChart
            type="doughnut"
            :data="seasonChartData"
            :options="seasonChartOptions"
            heightClass="h-[320px]"
          />
        </article>
      </section>

      <section class="mb-10 grid grid-cols-1 gap-8 lg:grid-cols-2">
        <article
          class="flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"
        >
          <div class="border-b border-slate-100 p-6">
            <h2 class="text-lg font-bold text-slate-900">Squad</h2>
            <p class="text-sm text-slate-500">Players currently registered for this team.</p>
          </div>

          <div v-if="teamPlayers.length === 0" class="p-6 text-sm text-slate-500">
            No players available for this team.
          </div>

          <div v-else class="divide-y divide-slate-100">
            <div
              v-for="player in teamPlayers"
              :key="player.id"
              class="flex items-center justify-between px-6 py-4 transition-colors hover:bg-slate-50"
            >
              <div class="flex items-center gap-3">
                <img
                  :src="player.imageUrl"
                  :alt="player.fullName"
                  class="h-12 w-12 rounded-full object-cover ring-1 ring-slate-200"
                />

                <div>
                  <p class="text-sm font-semibold text-slate-900">{{ player.fullName }}</p>
                  <p class="text-xs text-slate-500">
                    {{ player.position }} · #{{ player.shirtNumber }}
                  </p>
                </div>
              </div>

              <div class="text-right">
                <p class="text-sm font-bold text-[#1b69ff]">{{ player.goals }} G</p>
                <p class="text-xs text-slate-500">{{ player.assists }} A</p>
              </div>
            </div>
          </div>
        </article>

        <article class="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div class="mb-6">
            <h2 class="text-lg font-bold text-slate-900">Stadium Location</h2>
            <p class="text-sm text-slate-500">Explore the team stadium on the map.</p>
          </div>

          <LeafletMap
            :lat="6.2442"
            :lng="-75.5812"
            :stadium-name="`${team.name} Stadium`"
          />
        </article>
      </section>
    </div>
  </section>
</template>