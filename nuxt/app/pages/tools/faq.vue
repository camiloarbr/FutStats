<script setup lang="ts">
// 1. External imports

// 2. Internal imports
import { faqItems } from '../../domains/tools/faq.data'

useHead({
  title: 'FAQ CSR | FutStats Nuxt',
})
</script>

<template>
  <section class="page-stack">
    <NuxtLink class="text-link" to="/tools">Volver a tools</NuxtLink>

    <header class="page-hero">
      <p class="eyebrow">FAQ CSR</p>
      <h1>Preguntas frecuentes</h1>
      <p>
        Respuestas cortas sobre las decisiones de renderizado de esta mini
        version.
      </p>
    </header>

    <section class="faq-list">
      <article
        v-for="item in faqItems"
        :key="item.id"
        class="content-card faq-item"
      >
        <h2>{{ item.question }}</h2>
        <p>{{ item.answer }}</p>
      </article>
    </section>
  </section>
</template>
