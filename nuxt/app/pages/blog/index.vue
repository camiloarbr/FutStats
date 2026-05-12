<script setup lang="ts">
// 1. External imports

// 2. Internal imports
import { getBlogArticles } from '../../domains/blog/blog.repository'

const articles = getBlogArticles()

useHead({
  title: 'Blog | FutStats Nuxt',
})
</script>

<template>
  <section class="page-stack">
    <header class="page-hero">
      <p class="eyebrow">Blog SSG</p>
      <h1>Analisis para dashboards de futbol</h1>
      <p>
        Articulos breves sobre lectura ofensiva, goleadores y datos previos al
        analisis de un partido.
      </p>
    </header>

    <div class="article-grid">
      <BlogArticleCard
        v-for="article in articles"
        :key="article.slug"
        :article="article"
      />
    </div>
  </section>
</template>
