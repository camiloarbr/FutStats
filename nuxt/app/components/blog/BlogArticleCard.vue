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
  <article
    class="grid gap-2.5 rounded-lg border border-slate-200 bg-white p-5 shadow-md transition hover:-translate-y-0.5 hover:border-blue-300"
  >
    <div class="flex justify-between text-[0.78rem] font-extrabold uppercase tracking-wider text-blue-700">
      <span>{{ article.category }}</span>
      <span>{{ article.readingMinutes }} min</span>
    </div>
    <h2 class="m-0 text-[1.2rem] font-black leading-tight text-slate-900">{{ article.title }}</h2>
    <p class="m-0 text-slate-500">{{ article.summary }}</p>
    <NuxtLink
      class="w-fit text-[0.78rem] font-extrabold uppercase tracking-wider text-blue-700"
      :to="`/blog/${article.slug}`"
    >Leer articulo</NuxtLink>
  </article>
</template>
