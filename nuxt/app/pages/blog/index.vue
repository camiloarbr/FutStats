<script setup lang="ts">
// 1. External imports

// 2. Internal imports
import { getBlogArticles } from '../../domains/blog/blog.repository'

// 3. Data
const articles = getBlogArticles()

useHead({ title: 'Blog | FutStats Nuxt' })
</script>

<template>
  <section class="grid gap-6">
    <header
      class="rounded-lg bg-gradient-to-br from-slate-900 via-blue-700 to-cyan-600 p-[clamp(1.5rem,4vw,2.5rem)] text-white shadow-[0_28px_70px_rgba(15,23,42,0.22)]"
    >
      <p class="text-xs font-black uppercase tracking-[0.18em] text-white/70">Blog SSG</p>
      <h1 class="my-3 max-w-[16ch] text-[clamp(2rem,5vw,3.15rem)] font-black leading-none">Analisis para dashboards de futbol</h1>
      <p class="m-0 max-w-[46rem] text-white/80">
        Articulos breves sobre lectura ofensiva, goleadores y datos previos al analisis de un partido.
      </p>
    </header>

    <div class="grid gap-4 sm:grid-cols-3">
      <BlogArticleCard
        v-for="article in articles"
        :key="article.slug"
        :article="article"
      />
    </div>
  </section>
</template>
