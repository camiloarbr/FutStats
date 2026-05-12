<script setup lang="ts">
// 1. External imports

// 2. Internal imports
import type { BlogArticle } from '../../domains/blog/blog.types'

interface Props {
  article: BlogArticle
}

defineProps<Props>()
</script>

<template>
  <article class="content-card article-card">
    <div class="article-card__meta">
      <span>{{ article.category }}</span>
      <span>{{ article.readingMinutes }} min</span>
    </div>
    <h2>{{ article.title }}</h2>
    <p>{{ article.summary }}</p>
    <NuxtLink class="text-link" :to="`/blog/${article.slug}`"
      >Leer articulo</NuxtLink
    >
  </article>
</template>
