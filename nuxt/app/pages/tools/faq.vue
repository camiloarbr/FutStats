<script setup lang="ts">
// 1. External imports

// 2. Internal imports
import { faqItems } from '../../domains/tools/faq.data'

useHead({ title: 'FAQ CSR | FutStats Nuxt' })
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
      <p class="text-xs font-black uppercase tracking-[0.18em] text-white/70">FAQ CSR</p>
      <h1 class="my-3 max-w-[16ch] text-[clamp(2rem,5vw,3.15rem)] font-black leading-none">Preguntas frecuentes</h1>
      <p class="m-0 text-white/80">
        Respuestas cortas sobre las decisiones de renderizado de esta mini version.
      </p>
    </header>

    <section class="grid gap-4">
      <article
        v-for="item in faqItems"
        :key="item.id"
        class="grid gap-2.5 rounded-lg border border-slate-200 bg-white p-5 shadow-md"
      >
        <h2 class="m-0 text-[1.2rem] font-black leading-tight text-slate-900">{{ item.question }}</h2>
        <p class="m-0 text-slate-500">{{ item.answer }}</p>
      </article>
    </section>
  </section>
</template>
