<script setup lang="ts">
// 1. External imports

// 2. Internal imports
import { getBlogArticleBySlug } from '../../domains/blog/blog.repository'
import { getSlugFromParam } from '../../domains/blog/blog-route.utils'

const route = useRoute()
const slug = getSlugFromParam(route.params.slug)
const article = getBlogArticleBySlug(slug)

if (article === undefined) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Articulo no encontrado.',
  })
}

useHead({
  title: `${article.title} | FutStats Blog`,
})
</script>

<template>
  <article class="page-stack article-detail">
    <NuxtLink class="text-link" to="/blog">Volver al blog</NuxtLink>

    <header class="page-hero article-detail__hero">
      <p class="eyebrow">{{ article.category }}</p>
      <h1>{{ article.title }}</h1>
      <p>{{ article.summary }}</p>
      <div class="inline-stats">
        <StatTile
          label="Lectura"
          tone="cyan"
          :value="`${article.readingMinutes} min`"
        />
        <StatTile label="Enfoque" tone="green" :value="article.heroStat" />
      </div>
    </header>

    <section class="article-body">
      <div
        v-for="section in article.sections"
        :key="section.heading"
        class="article-section"
      >
        <h2>{{ section.heading }}</h2>
        <p>{{ section.body }}</p>
      </div>
    </section>
  </article>
</template>
