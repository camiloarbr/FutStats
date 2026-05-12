<script setup lang="ts">
// 1. External imports

// 2. Internal imports

interface Props {
  label: string
  tone?: 'blue' | 'cyan' | 'green' | 'slate'
  value: string | number
}

const props = withDefaults(defineProps<Props>(), {
  tone: 'blue',
})

// 3. Derived state
const toneClasses: Record<NonNullable<Props['tone']>, string> = {
  blue: 'bg-blue-100 border-blue-200',
  cyan: 'bg-cyan-100 border-cyan-200',
  green: 'bg-emerald-100 border-emerald-200',
  slate: 'bg-slate-200 border-slate-300',
}
</script>

<template>
  <article
    class="grid min-w-[9.2rem] gap-1 rounded-lg border px-4 py-3.5"
    :class="toneClasses[props.tone]"
  >
    <span class="text-[0.78rem] font-extrabold uppercase tracking-wider text-slate-500">{{ label }}</span>
    <strong class="text-[1.35rem] font-black leading-tight text-slate-900">{{ value }}</strong>
  </article>
</template>
