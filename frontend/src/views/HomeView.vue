// @author: Victor Chavez | FutStats
<script setup lang="ts">
// 1. External imports
import { computed } from 'vue'

// 2. Internal imports
import DashboardGoalsChart from '@/components/charts/DashboardGoalsChart.vue'
import DataStateBanner from '@/components/ui/DataStateBanner.vue'
import type { TopScorerRow } from '@/interfaces/DashboardInterface'
import { MatchService } from '@/services/MatchService'
import { PlayerService } from '@/services/PlayerService'
import { TeamService } from '@/services/TeamService'
import { FutStatsDataService } from '@/services/FutStatsDataService'
import { useAuthStore } from '@/stores/useAuthStore'
import { useDataStatusStore } from '@/stores/useDataStatusStore'
import { Formatters } from '@/utils/Formatters'

const authStore = useAuthStore()
const dataStatusStore = useDataStatusStore()

const username = computed((): string => authStore.currentUser?.username ?? 'User')

const totalTeams = computed((): number => TeamService.getAll().length)
const totalPlayers = computed((): number => PlayerService.getAll().length)
const totalMatches = computed((): number => MatchService.getAll().length)
const teams = computed(() => TeamService.getAll())

const topScorers = computed((): TopScorerRow[] => {
  const teams = TeamService.getAll()

  return PlayerService.getTopScorers().map((player, index) => {
    const team = teams.find((currentTeam) => currentTeam.id === player.teamId)

    return {
      initials: Formatters.buildInitials(player.fullName),
      initialsClass: Formatters.resolveInitialsClass(index),
      name: player.fullName,
      team: team?.name ?? 'Unknown Team',
      goals: player.goals,
      assists: player.assists,
    }
  })
})

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
          Season Pulse
        </p>
        <h1 class="mb-[0.35rem] text-[clamp(2rem,4vw,2.8rem)] font-extrabold">
          Welcome back, {{ username }}
        </h1>
        <p class="max-w-[32rem] text-white/85">
          Track everything happening across FutStats with live scorers, trends, and key roster
          metrics.
        </p>
      </div>
      <div class="grid grid-cols-[repeat(auto-fit,minmax(120px,1fr))] gap-4">
        <div>
          <span class="text-[0.75rem] uppercase tracking-[0.25em] text-white/70">Teams</span>
          <strong class="block text-[1.8rem] font-extrabold">{{ totalTeams }}</strong>
        </div>
        <div>
          <span class="text-[0.75rem] uppercase tracking-[0.25em] text-white/70">Players</span>
          <strong class="block text-[1.8rem] font-extrabold">{{ totalPlayers }}</strong>
        </div>
        <div>
          <span class="text-[0.75rem] uppercase tracking-[0.25em] text-white/70">Matches</span>
          <strong class="block text-[1.8rem] font-extrabold">{{ totalMatches }}</strong>
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
        class="flex flex-col gap-2 overflow-hidden rounded-3xl bg-gradient-to-br from-[#2563eb] to-[#38bdf8] p-7 text-white shadow-[0_25px_60px_rgba(15,23,42,0.2)]"
      >
        <div class="grid h-10 w-10 place-items-center rounded-2xl bg-white/20 text-[1.25rem]">
          👥
        </div>
        <div>
          <p class="text-[0.85rem] uppercase tracking-[0.2em]">Tracked Teams</p>
          <h3 class="text-[2.2rem] font-extrabold">{{ totalTeams }}</h3>
        </div>
        <span class="text-[0.9rem] text-white/80">Active roster</span>
      </article>

      <article
        class="flex flex-col gap-2 overflow-hidden rounded-3xl bg-gradient-to-br from-[#ecfeff] to-[#e0f2fe] p-7 text-slate-900 shadow-[0_20px_50px_rgba(14,165,233,0.2)]"
      >
        <div
          class="grid h-10 w-10 place-items-center rounded-2xl bg-slate-900/[0.08] text-[1.25rem]"
        >
          👤
        </div>
        <div>
          <p class="text-[0.85rem] uppercase tracking-[0.2em]">Registered Players</p>
          <h3 class="text-[2.2rem] font-extrabold">{{ totalPlayers }}</h3>
        </div>
        <span class="text-[0.9rem] text-slate-700">Updated daily</span>
      </article>

      <article
        class="flex flex-col gap-2 overflow-hidden rounded-3xl bg-gradient-to-br from-[#0f172a] to-[#1e293b] p-7 text-white shadow-[0_25px_60px_rgba(15,23,42,0.2)]"
      >
        <div class="grid h-10 w-10 place-items-center rounded-2xl bg-white/20 text-[1.25rem]">
          ⚽
        </div>
        <div>
          <p class="text-[0.85rem] uppercase tracking-[0.2em]">Total Matches</p>
          <h3 class="text-[2.2rem] font-extrabold">{{ totalMatches }}</h3>
        </div>
        <span class="text-[0.9rem] text-white/80">Season 23/24</span>
      </article>
    </section>

    <section class="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-6">
      <article
        class="flex flex-col gap-5 rounded-[1.75rem] border border-slate-900/[0.07] bg-white p-6 shadow-[0_35px_80px_rgba(15,23,42,0.1)]"
      >
        <div class="flex items-center justify-between">
          <div>
            <p class="mb-[0.2rem] text-[0.75rem] uppercase tracking-[0.35em] text-blue-500">
              Leaderboard
            </p>
            <h2 class="text-[1.3rem] font-bold text-slate-900">Top 5 Scorers</h2>
          </div>
          <span class="text-[0.8rem] uppercase tracking-[0.2em] text-slate-400">Live ranking</span>
        </div>

        <div
          v-if="topScorers.length === 0 && !dataStatusStore.isLoading"
          class="rounded-xl border border-dashed border-slate-200 py-12 text-center text-sm text-slate-400"
        >
          No player scoring data available
        </div>

        <div v-else class="overflow-x-auto">
          <table class="w-full border-collapse">
            <thead class="bg-slate-100">
              <tr>
                <th class="px-4 py-[0.85rem] text-left text-[0.9rem]">Name</th>
                <th class="px-4 py-[0.85rem] text-left text-[0.9rem]">Team</th>
                <th class="px-4 py-[0.85rem] text-center text-[0.9rem]">Goals</th>
                <th class="px-4 py-[0.85rem] text-center text-[0.9rem]">Assists</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="player in topScorers"
                :key="player.name"
                class="border-b border-slate-200/20 transition-colors duration-200 hover:bg-slate-900/[0.02]"
              >
                <td class="px-4 py-[0.85rem] text-[0.9rem]">
                  <div class="flex items-center gap-3 font-semibold text-slate-900">
                    <span
                      class="grid h-9 w-9 place-items-center rounded-full text-[0.8rem] font-bold"
                      :class="player.initialsClass"
                    >
                      {{ player.initials }}
                    </span>
                    {{ player.name }}
                  </div>
                </td>
                <td class="px-4 py-[0.85rem] text-[0.9rem]">{{ player.team }}</td>
                <td class="px-4 py-[0.85rem] text-center text-[0.9rem] text-indigo-500">
                  {{ player.goals }}
                </td>
                <td class="px-4 py-[0.85rem] text-center text-[0.9rem] text-slate-500">
                  {{ player.assists }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </article>

      <article
        class="flex flex-col gap-5 rounded-[1.75rem] border border-slate-900/[0.07] bg-white p-6 shadow-[0_35px_80px_rgba(15,23,42,0.1)]"
      >
        <div class="flex items-center justify-between">
          <div>
            <p class="mb-[0.2rem] text-[0.75rem] uppercase tracking-[0.35em] text-blue-500">
              Momentum
            </p>
            <h2 class="text-[1.3rem] font-bold text-slate-900">Goals per Team</h2>
          </div>
          <span class="text-[0.8rem] uppercase tracking-[0.2em] text-slate-400"
            >Updated automatically</span
          >
        </div>

        <DashboardGoalsChart :teams="teams" />
      </article>
    </section>
  </section>
</template>
