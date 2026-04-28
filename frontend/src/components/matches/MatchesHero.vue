// @author: Victor Chavez | FutStats
<script setup lang="ts">
interface SummaryStat {
  id: string
  label: string
  value: string
  helper: string
  accent: string
}

const props = defineProps<{
  summaryStats: SummaryStat[]
}>()
</script>

<template>
  <div
    class="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0f172a] via-[#1d4ed8] to-[#22d3ee] p-8 text-white shadow-[0_40px_80px_rgba(15,23,42,0.35)]"
  >
    <div
      class="relative flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between xl:gap-10"
    >
      <div class="flex max-w-[36rem] flex-col gap-4">
        <p class="text-[0.75rem] font-semibold uppercase tracking-[0.3em] text-white/65">
          Season Intelligence
        </p>
        <div>
          <h2 class="text-[clamp(2rem,5vw,2.75rem)] font-extrabold leading-[1.1]">
            Matches Overview
          </h2>
          <p class="mt-2 text-white/78">
            Keep an eye on form, intensity, and goals with a live dashboard that adapts to every
            filter you apply.
          </p>
        </div>
        <div class="flex flex-wrap gap-3 text-[0.75rem] text-white/78">
          <span
            class="inline-flex items-center gap-2 rounded-full bg-white/[0.12] px-3 py-[0.4rem]"
          >
            <span class="h-[0.6rem] w-[0.6rem] rounded-full bg-emerald-300"></span>
            Synced with season data
          </span>
          <span
            class="inline-flex items-center gap-2 rounded-full bg-white/[0.12] px-3 py-[0.4rem]"
          >
            <span class="h-[0.6rem] w-[0.6rem] rounded-full bg-sky-300"></span>
            Admin visibility
          </span>
        </div>
      </div>

      <div class="min-w-0 flex-1">
        <dl class="grid gap-4 sm:grid-cols-2">
          <div
            v-for="(stat, index) in props.summaryStats"
            :key="stat.id"
            class="relative overflow-hidden rounded-[1.25rem] border border-white/20 p-5 shadow-[0_15px_35px_rgba(15,23,42,0.25)] opacity-0 translate-y-4 scale-[0.98] animate-[matchesFade_0.7s_ease_forwards]"
            :style="{ animationDelay: `${index * 120}ms` }"
          >
            <div
              class="absolute inset-0 opacity-85 bg-gradient-to-br"
              :class="stat.accent"
            ></div>
            <div class="relative flex flex-col gap-[0.2rem]">
              <dt class="text-[0.7rem] font-semibold uppercase tracking-[0.35em] text-white/75">
                {{ stat.label }}
              </dt>
              <dd class="text-[1.75rem] font-extrabold">{{ stat.value }}</dd>
              <p class="text-[0.85rem] text-white/88">{{ stat.helper }}</p>
            </div>
          </div>
        </dl>
      </div>
    </div>

    <div
      class="pointer-events-none absolute -bottom-[120px] -right-10 h-[320px] w-[320px] rounded-full opacity-35 blur-[80px] animate-[heroBlob_18s_ease-in-out_infinite]"
      style="background: radial-gradient(circle, rgba(56,189,248,0.8), transparent 70%)"
    ></div>
    <div
      class="pointer-events-none absolute -left-[60px] -top-[80px] h-[320px] w-[320px] rounded-full opacity-35 blur-[80px] animate-[heroBlob_18s_ease-in-out_infinite]"
      style="
        background: radial-gradient(circle, rgba(14, 165, 233, 0.7), transparent 65%);
        animation-delay: 6s;
      "
    ></div>
  </div>
</template>
