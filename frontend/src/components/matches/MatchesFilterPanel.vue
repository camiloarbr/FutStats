// @author: Victor Chavez | FutStats
<script setup lang="ts">
interface OptionItem {
  value: string
  label: string
}

const props = defineProps<{
  modelValue: string
  options: OptionItem[]
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()
</script>

<template>
  <div
    class="flex flex-col gap-6 rounded-[1.5rem] border border-blue-500/20 bg-white/90 p-6 shadow-[0_25px_60px_rgba(59,130,246,0.12)] backdrop-blur-[6px] md:flex-row md:items-center md:justify-between"
  >
    <div class="flex flex-col gap-2">
      <p class="text-[0.7rem] font-bold uppercase tracking-[0.3em] text-blue-500">Filters</p>
      <h3 class="text-[1.25rem] font-semibold text-slate-900">Focus on a single club</h3>
      <p class="text-sm text-slate-500">
        Compare league-wide momentum or zoom into one team to inspect their match streak.
      </p>
    </div>
    <div class="w-full max-w-[16rem]">
      <label class="flex flex-col gap-2">
        <span class="text-xs font-bold uppercase tracking-[0.3em] text-blue-600">Team</span>
        <select
          class="w-full rounded-2xl border border-blue-600/20 bg-white px-4 py-3 text-slate-900 outline-none"
          :value="props.modelValue"
          @change="emit('update:modelValue', ($event.target as HTMLSelectElement).value)"
        >
          <option value="">All teams</option>
          <option v-for="option in props.options" :key="option.value" :value="option.value">
            {{ option.label }}
          </option>
        </select>
      </label>
    </div>
  </div>
</template>
