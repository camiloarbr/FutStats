// @author: Victor Chavez | FutStats
<script setup lang="ts">
interface StatComparison {
  id: string
  label: string
  homeValue: number
  awayValue: number
  unit?: string
}

const props = defineProps<{
  statComparisons: StatComparison[]
}>()

function calculateShare(primaryValue: number, secondaryValue: number): number {
  const total = primaryValue + secondaryValue
  if (total === 0) {
    return 50
  }

  const percentage = (primaryValue / total) * 100
  return Math.min(90, Math.max(10, Math.round(percentage)))
}
</script>

<template>
  <div
    class="rounded-[1.75rem] border border-blue-500/15 bg-white/90 p-7 shadow-[0_30px_70px_rgba(59,130,246,0.15)]"
  >
    <p class="text-[0.7rem] font-semibold uppercase tracking-[0.3em] text-blue-500">Summary</p>
    <h3 class="mt-[0.3rem] text-[1.4rem] font-bold text-slate-900">Head-to-head breakdown</h3>

    <div class="mt-6 flex flex-col gap-5">
      <div v-for="comparison in props.statComparisons" :key="comparison.id">
        <div class="flex items-center justify-between text-[0.9rem] font-semibold text-slate-700">
          <span>{{ comparison.label }}</span>
          <span class="text-[0.75rem] text-slate-400">{{ comparison.unit ?? '' }}</span>
        </div>
        <div class="mt-3 grid grid-cols-2 gap-1">
          <div
            class="min-w-[2.75rem] rounded-full bg-gradient-to-r from-blue-600/15 to-blue-500/40 px-3 py-[0.4rem] text-center text-[0.8rem] font-semibold text-blue-700"
            :style="{ width: `${calculateShare(comparison.homeValue, comparison.awayValue)}%` }"
          >
            <span>{{ comparison.homeValue }}{{ comparison.unit ?? '' }}</span>
          </div>
          <div
            class="min-w-[2.75rem] rounded-full bg-gradient-to-r from-sky-500/20 to-sky-500/45 px-3 py-[0.4rem] text-center text-[0.8rem] font-semibold text-sky-600"
            :style="{ width: `${calculateShare(comparison.awayValue, comparison.homeValue)}%` }"
          >
            <span>{{ comparison.awayValue }}{{ comparison.unit ?? '' }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
