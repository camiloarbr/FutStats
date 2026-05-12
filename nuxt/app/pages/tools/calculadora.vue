<script setup lang="ts">
// 1. External imports

// 2. Internal imports
import {
  calculateContributionPerMatch,
  calculateDirectContributions,
} from '../../domains/tools/calculator.utils'

const goals = ref<number>(18)
const assists = ref<number>(9)
const matchesPlayed = ref<number>(27)

const inputs = computed(() => ({
  assists: assists.value,
  goals: goals.value,
  matchesPlayed: matchesPlayed.value,
}))

const directContributions = computed<number>(() =>
  calculateDirectContributions(inputs.value),
)
const contributionPerMatch = computed<string>(() =>
  calculateContributionPerMatch(inputs.value),
)

useHead({
  title: 'Calculadora CSR | FutStats Nuxt',
})
</script>

<template>
  <section class="page-stack">
    <NuxtLink class="text-link" to="/tools">Volver a tools</NuxtLink>

    <header class="page-hero">
      <p class="eyebrow">Calculadora CSR</p>
      <h1>Participacion directa</h1>
      <p>
        Calcula el aporte ofensivo de un jugador con goles, asistencias y
        partidos jugados.
      </p>
    </header>

    <section class="calculator-layout">
      <form class="content-card form-card">
        <label for="goals">
          Goles
          <input id="goals" v-model.number="goals" min="0" type="number" />
        </label>
        <label for="assists">
          Asistencias
          <input id="assists" v-model.number="assists" min="0" type="number" />
        </label>
        <label for="matches">
          Partidos jugados
          <input
            id="matches"
            v-model.number="matchesPlayed"
            min="1"
            type="number"
          />
        </label>
      </form>

      <div class="metric-row">
        <StatTile
          label="Goles + asistencias"
          tone="green"
          :value="directContributions"
        />
        <StatTile
          label="Aporte por partido"
          tone="cyan"
          :value="contributionPerMatch"
        />
      </div>
    </section>
  </section>
</template>
