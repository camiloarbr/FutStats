<script setup lang="ts">
// 1. External imports

// 2. Internal imports
import {
  calculateContributionPerMatch,
  calculateDirectContributions,
} from '../../domains/tools/calculator.utils'

// 3. State
const goals = ref<number>(18)
const assists = ref<number>(9)
const matchesPlayed = ref<number>(27)

// 4. Derived state
const inputs = computed(() => ({
  assists: assists.value,
  goals: goals.value,
  matchesPlayed: matchesPlayed.value,
}))

const directContributions = computed<number>(() => calculateDirectContributions(inputs.value))
const contributionPerMatch = computed<string>(() => calculateContributionPerMatch(inputs.value).toFixed(2))

useHead({ title: 'Calculadora CSR | FutStats Nuxt' })
</script>

<template>
  <section class="grid gap-6">
    <NuxtLink
      class="w-fit text-[0.78rem] font-black uppercase tracking-wider text-blue-700"
      to="/tools"
    >Volver a tools</NuxtLink>

    <header
      class="rounded-lg bg-gradient-to-br from-slate-900 via-blue-700 to-cyan-600 p-[clamp(1.5rem,4vw,2.5rem)] text-white shadow-[0_28px_70px_rgba(15,23,42,0.22)]"
    >
      <p class="text-xs font-black uppercase tracking-[0.18em] text-white/70">Calculadora CSR</p>
      <h1 class="my-3 max-w-[16ch] text-[clamp(2rem,5vw,3.15rem)] font-black leading-none">Participacion directa</h1>
      <p class="m-0 text-white/80">
        Calcula el aporte ofensivo de un jugador con goles, asistencias y partidos jugados.
      </p>
    </header>

    <section class="grid gap-4 md:grid-cols-2">
      <form class="grid gap-4 rounded-lg border border-slate-200 bg-white p-5 shadow-md">
        <label class="grid gap-1.5 font-black text-slate-900">
          Goles
          <input
            id="goals"
            v-model.number="goals"
            class="min-h-[2.8rem] rounded-lg border border-slate-200 px-3 py-2.5 text-slate-900 focus:border-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-700/10"
            min="0"
            type="number"
          />
        </label>
        <label class="grid gap-1.5 font-black text-slate-900">
          Asistencias
          <input
            id="assists"
            v-model.number="assists"
            class="min-h-[2.8rem] rounded-lg border border-slate-200 px-3 py-2.5 text-slate-900 focus:border-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-700/10"
            min="0"
            type="number"
          />
        </label>
        <label class="grid gap-1.5 font-black text-slate-900">
          Partidos jugados
          <input
            id="matches"
            v-model.number="matchesPlayed"
            class="min-h-[2.8rem] rounded-lg border border-slate-200 px-3 py-2.5 text-slate-900 focus:border-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-700/10"
            min="1"
            type="number"
          />
        </label>
      </form>

      <div class="flex flex-wrap content-start gap-3">
        <StatTile label="Goles + asistencias" tone="green" :value="directContributions" />
        <StatTile label="Aporte por partido" tone="cyan" :value="contributionPerMatch" />
      </div>
    </section>
  </section>
</template>
