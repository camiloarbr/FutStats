// @author: Victor Chavez | FutStats
<script setup lang="ts">
interface TeamSide {
  name: string
  score: number
  badge: string
}

interface ScoreboardData {
  home: TeamSide
  away: TeamSide
  stadium: string
}

interface HighlightMetric {
  label: string
  value: string
  tone: 'emerald' | 'sky'
}

const props = defineProps<{
  scoreboard: ScoreboardData
  formattedDate: string
  highlights: HighlightMetric[]
}>()
</script>

<template>
  <div
    class="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0f172a] via-[#1e3a8a] to-[#22d3ee] p-8 text-white shadow-[0_40px_90px_rgba(15,23,42,0.45)]"
  >
    <div
      class="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between lg:gap-10"
    >
      <div class="flex flex-1 flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div class="flex flex-col items-center gap-2 text-center">
          <div
            class="grid h-20 w-20 place-items-center rounded-full border border-white/20 bg-white/[0.12] p-3 backdrop-blur-[4px]"
          >
            <img
              :src="props.scoreboard.home.badge"
              :alt="props.scoreboard.home.name"
              class="h-full w-full object-contain"
            />
          </div>
          <p class="text-[0.75rem] font-semibold uppercase tracking-[0.3em] text-white/70">Home</p>
          <h3 class="font-semibold">{{ props.scoreboard.home.name }}</h3>
        </div>

        <div class="flex flex-col items-center gap-2 text-center">
          <p class="text-[0.8rem] uppercase tracking-[0.4em] text-white/65">Full Time</p>
          <div
            class="flex items-center justify-center gap-4 text-[clamp(2.5rem,5vw,4rem)] font-extrabold tracking-[-0.05em]"
          >
            <span>{{ props.scoreboard.home.score }}</span>
            <span>:</span>
            <span>{{ props.scoreboard.away.score }}</span>
          </div>
          <p class="text-[0.85rem] text-white/70">{{ props.formattedDate }}</p>
        </div>

        <div class="flex flex-col items-center gap-2 text-center">
          <div
            class="grid h-20 w-20 place-items-center rounded-full border border-white/20 bg-white/[0.12] p-3 backdrop-blur-[4px]"
          >
            <img
              :src="props.scoreboard.away.badge"
              :alt="props.scoreboard.away.name"
              class="h-full w-full object-contain"
            />
          </div>
          <p class="text-[0.75rem] font-semibold uppercase tracking-[0.3em] text-white/70">Away</p>
          <h3 class="font-semibold">{{ props.scoreboard.away.name }}</h3>
        </div>
      </div>

      <div
        class="flex-1 rounded-[1.25rem] border border-white/25 bg-white/[0.12] p-5 backdrop-blur-[6px]"
      >
        <p class="text-[0.7rem] font-semibold uppercase tracking-[0.4em] text-white/65">Venue</p>
        <p class="text-[1.125rem] font-semibold">{{ props.scoreboard.stadium }}</p>
        <div class="mt-4 grid gap-3 md:grid-cols-2">
          <div
            v-for="metric in props.highlights"
            :key="metric.label"
            class="rounded-2xl border border-white/30 bg-white/10 p-4"
            :class="metric.tone === 'emerald' ? 'text-emerald-300' : 'text-sky-300'"
          >
            <p class="text-[0.65rem] uppercase tracking-[0.35em] text-white/65">
              {{ metric.label }}
            </p>
            <span class="mt-[0.4rem] block text-[1.35rem] font-extrabold">{{ metric.value }}</span>
          </div>
        </div>
      </div>
    </div>

    <div
      class="pointer-events-none absolute -bottom-[140px] -right-[60px] h-[420px] w-[420px] rounded-full opacity-35 blur-[110px] animate-[scoreboardPulse_18s_ease-in-out_infinite]"
      style="background: radial-gradient(circle, rgba(14, 165, 233, 0.7), transparent 65%)"
    ></div>
    <div
      class="pointer-events-none absolute -left-[90px] -top-[120px] h-[360px] w-[360px] rounded-full opacity-35 blur-[110px] animate-[scoreboardPulse_18s_ease-in-out_infinite]"
      style="
        background: radial-gradient(circle, rgba(59, 130, 246, 0.7), transparent 60%);
        animation-delay: 6s;
      "
    ></div>
  </div>
</template>
