// @author: Samuel | FutStats
<script setup lang="ts">
import { computed } from 'vue'
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
const teamPerformance = computed(() => TeamService.getTeamPerformance())
</script>

<template>
  <section class="w-full bg-[#f4f7fa] px-6 py-8 md:px-10">
    <div class="mx-auto w-full max-w-7xl">
      <section class="mb-8">
        <div class="flex flex-col gap-1">
          <h1 class="text-3xl font-extrabold tracking-tight text-slate-900">
            Welcome back, {{ username }}
          </h1>
          <p class="text-slate-500">Here is your football analytics overview for today.</p>
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
              <span class="text-lg">👤</span>
            </div>
            <span
              class="rounded bg-emerald-50 px-2 py-1 text-xs font-bold uppercase tracking-wider text-emerald-500"
            >
              +2 New
            </span>
          </div>

          <div class="mt-4 text-slate-900">
            <p class="text-sm font-medium text-slate-500">Total Players</p>
            <h3 class="mt-1 text-4xl font-black">{{ totalPlayers }}</h3>
          </div>
        </article>

        <article
          class="flex flex-col justify-between rounded-xl bg-[#0d1525] p-6 text-white shadow-sm transition-transform duration-300 hover:scale-[1.02]"
        >
          <div class="flex items-start justify-between">
            <div class="rounded-lg bg-white/10 p-2 text-white">
              <span class="text-lg">⚽</span>
            </div>
            <span
              class="rounded bg-[#1b69ff]/10 px-2 py-1 text-xs font-bold uppercase tracking-wider text-[#1b69ff]"
            >
              Season 23/24
            </span>
          </div>

          <div class="mt-4">
            <p class="text-sm font-medium text-slate-400">Total Matches</p>
            <h3 class="mt-1 text-4xl font-black">{{ totalMatches }}</h3>
          </div>
        </article>
      </section>

      <section class="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <article
          class="flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"
        >
          <div class="flex items-center justify-between border-b border-slate-100 p-6">
            <div>
              <h2 class="text-lg font-bold text-slate-900">Top 5 Scorers</h2>
              <p class="text-sm text-slate-500">Current league leading performers</p>
            </div>

            <button type="button" class="text-sm font-semibold text-[#1b69ff] hover:underline">
              View All
            </button>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full text-left">
              <thead class="bg-slate-50">
                <tr>
                  <th class="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                    Name
                  </th>
                  <th class="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                    Team
                  </th>
                  <th
                    class="px-6 py-4 text-center text-xs font-bold uppercase tracking-wider text-slate-500"
                  >
                    Goals
                  </th>
                  <th
                    class="px-6 py-4 text-center text-xs font-bold uppercase tracking-wider text-slate-500"
                  >
                    Assists
                  </th>
                </tr>
              </thead>

              <tbody class="divide-y divide-slate-100">
                <tr
                  v-for="player in topScorers"
                  :key="player.name"
                  class="transition-colors hover:bg-slate-50"
                >
                  <td class="whitespace-nowrap px-6 py-4">
                    <div class="flex items-center gap-3">
                      <div
                        class="flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold"
                        :class="player.initialsClass"
                      >
                        {{ player.initials }}
                      </div>
                      <span class="text-sm font-semibold text-slate-900">
                        {{ player.name }}
                      </span>
                    </div>
                  </td>

                  <td class="whitespace-nowrap px-6 py-4 text-sm text-slate-600">
                    {{ player.team }}
                  </td>

                  <td
                    class="whitespace-nowrap px-6 py-4 text-center text-sm font-bold text-[#1b69ff]"
                  >
                    {{ player.goals }}
                  </td>

                  <td class="whitespace-nowrap px-6 py-4 text-center text-sm text-slate-600">
                    {{ player.assists }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </article>

        <article class="flex flex-col rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div class="mb-6">
            <h2 class="text-lg font-bold text-slate-900">Goals per Team</h2>
            <p class="text-sm text-slate-500">Total offensive contribution by squad</p>
          </div>

          <div class="flex flex-1 flex-col justify-around gap-4">
            <div
              v-for="team in teamPerformance"
              :key="team.name"
              class="space-y-1.5"
            >
              <div
                class="flex justify-between text-xs font-semibold uppercase tracking-wider text-slate-500"
              >
                <span>{{ team.name }}</span>
                <span class="text-slate-900">{{ team.goals }} Goals</span>
              </div>

              <div class="h-3 w-full overflow-hidden rounded-full bg-slate-100">
                <div
                  class="h-full rounded-full transition-all duration-300"
                  :class="team.barClass"
                  :style="{ width: `${team.width}%` }"
                ></div>
              </div>
            </div>
          </div>

          <div class="mt-6 flex items-center justify-between border-t border-slate-100 pt-4">
            <div class="flex items-center gap-2">
              <div class="h-3 w-3 rounded bg-[#1b69ff]"></div>
              <span class="text-xs text-slate-500">Highest Performance</span>
            </div>

            <div class="flex items-center gap-2">
              <div class="h-3 w-3 rounded bg-[#bfdcff]"></div>
              <span class="text-xs text-slate-500">Average Performance</span>
            </div>
          </div>
        </article>
      </section>
    </div>
  </section>
</template>