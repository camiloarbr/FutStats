// @author: Victor Chavez | FutStats
<script setup lang="ts">
// 1. External imports
import { computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

// 2. Internal imports
import PlayerPerformanceChart from '@/components/players/PlayerPerformanceChart.vue'
import type { PlayerInterface } from '@/interfaces/PlayerInterface'
import type { TeamInterface } from '@/interfaces/TeamInterface'
import { PlayerService } from '@/services/PlayerService'
import { TeamService } from '@/services/TeamService'
import { Formatters } from '@/utils/Formatters'

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

const playerImage = computed<string>(
  () => player.value?.imageUrl || 'https://placehold.co/320x320?text=Player'
)

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

    document.title = Formatters.formatPageTitle(currentPlayer.fullName)
  },
  { immediate: true }
)
</script>

<template>
  <section v-if="player" class="space-y-8">
    <article
      class="flex flex-col gap-6 rounded-[2rem] bg-gradient-to-br from-[#0f172a] via-[#1d4ed8] to-[#22d3ee] p-8 text-white shadow-[0_35px_80px_rgba(15,23,42,0.35)] md:flex-row md:items-center md:justify-between"
    >
      <div>
        <p class="text-[0.75rem] font-bold uppercase tracking-[0.35em] text-white/70">
          Player Profile
        </p>
        <h1 class="mt-[0.25rem] text-[clamp(2rem,4vw,3rem)] font-extrabold">
          {{ player.fullName }}
        </h1>
        <p class="text-white/90">
          {{ player.position }} • {{ player.nationality }} • Shirt #{{ player.shirtNumber }}
        </p>
        <div
          class="mt-4 flex flex-col gap-[0.35rem] text-[0.75rem] uppercase tracking-[0.25em]"
        >
          <span class="text-white/70">Team</span>
          <strong class="text-[1.4rem] font-extrabold normal-case tracking-normal">{{
            team?.name ?? 'Free Agent'
          }}</strong>
        </div>
      </div>
      <div
        class="mx-auto max-w-[320px] overflow-hidden rounded-3xl border border-white/40"
      >
        <img
          :src="playerImage"
          :alt="`${player.fullName} portrait`"
          class="block w-full object-cover"
        />
      </div>
    </article>

    <div class="grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-5">
      <div
        v-for="stat in spotlightStats"
        :key="stat.id"
        class="relative overflow-hidden rounded-3xl p-6 text-white shadow-[0_20px_60px_rgba(15,23,42,0.2)]"
      >
        <div
          class="absolute inset-0 opacity-85 bg-gradient-to-br"
          :class="stat.accent"
        ></div>
        <div class="relative flex flex-col gap-[0.2rem]">
          <p class="text-[0.75rem] uppercase tracking-[0.3em] text-white/85">{{ stat.label }}</p>
          <strong class="text-[2rem] font-extrabold">{{ stat.value }}</strong>
          <span class="text-white/90">{{ stat.helper }}</span>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-6">
      <PlayerPerformanceChart :player="player" />

      <div
        class="rounded-3xl border border-slate-900/[0.07] bg-white p-7 shadow-[0_30px_70px_rgba(15,23,42,0.08)]"
      >
        <h3 class="mb-5 text-[1.1rem] font-bold">Match Impact</h3>
        <dl class="flex flex-col gap-4">
          <div
            v-for="metric in extendedStats"
            :key="metric.id"
            class="flex items-center justify-between border-b border-slate-300/30 pb-3 last:border-b-0 last:pb-0"
          >
            <dt class="text-[0.9rem] text-slate-500">{{ metric.label }}</dt>
            <dd class="text-[1.2rem] font-bold text-slate-900">{{ metric.value }}</dd>
          </div>
        </dl>
      </div>
    </div>
  </section>
  <section
    v-else
    class="rounded-3xl border border-dashed border-slate-300/50 p-8 text-center text-slate-500"
  >
    <p>Loading player data...</p>
  </section>
</template>
