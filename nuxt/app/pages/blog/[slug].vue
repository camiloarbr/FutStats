<script setup lang="ts">
// 1. External imports

// 2. Internal imports
import { getBlogArticleBySlug } from '../../domains/blog/blog.repository'
import { getSlugFromParam } from '../../domains/blog/blog-route.utils'

// 3. Data
const route = useRoute()
const slug = getSlugFromParam(route.params.slug)
const article = getBlogArticleBySlug(slug)

if (article === undefined) {
  throw createError({ statusCode: 404, statusMessage: 'Articulo no encontrado.' })
}

useHead({ title: `${article.title} | FutStats Blog` })
</script>

<template>
  <article class="grid gap-6">
    <NuxtLink
      class="w-fit text-[0.78rem] font-black uppercase tracking-wider text-blue-700"
      to="/blog"
    >Volver al blog</NuxtLink>

    <header
      class="rounded-lg bg-gradient-to-br from-slate-900 via-blue-700 to-cyan-600 p-[clamp(1.5rem,4vw,2.5rem)] text-white shadow-[0_28px_70px_rgba(15,23,42,0.22)]"
    >
      <p class="text-xs font-black uppercase tracking-[0.18em] text-white/70">{{ article.category }}</p>
      <h1 class="my-3 max-w-[20ch] text-[clamp(2rem,5vw,3.15rem)] font-black leading-none">{{ article.title }}</h1>
      <p class="m-0 max-w-[46rem] text-white/80">{{ article.summary }}</p>
      <div class="mt-5 flex flex-wrap gap-3">
        <StatTile label="Lectura" tone="cyan" :value="`${article.readingMinutes} min`" />
        <StatTile label="Enfoque" tone="green" :value="article.heroStat" />
      </div>
    </header>

    <section class="grid gap-4">
      <div
        v-for="section in article.sections"
        :key="section.heading"
        class="grid gap-2.5 rounded-lg border-l-4 border-blue-700 bg-white p-5"
      >
        <h2 class="m-0 text-[1.2rem] font-black leading-tight text-slate-900">{{ section.heading }}</h2>
        <p class="m-0 text-slate-500">{{ section.body }}</p>
      </div>
    </section>
  </article>
</template>
