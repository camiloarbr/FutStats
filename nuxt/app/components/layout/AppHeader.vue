<template>
  <header
    class="sticky top-0 z-10 flex items-center justify-between gap-5 border-b border-slate-200/90 bg-white/90 px-4 py-4 md:px-10"
  >
    <NuxtLink class="inline-flex items-center gap-3" to="/">
      <span
        class="grid h-[2.6rem] w-[2.6rem] place-items-center rounded-lg bg-gradient-to-br from-blue-700 to-cyan-600 font-black text-white"
      >FS</span>
      <span class="grid gap-0.5">
        <strong class="text-base font-extrabold text-slate-900">FutStats</strong>
        <small class="text-xs font-bold text-slate-500">Nuxt edition</small>
      </span>
    </NuxtLink>

    <nav class="flex flex-wrap items-center justify-end gap-1" aria-label="Navegacion principal">
      <NuxtLink
        class="rounded-full px-3.5 py-2 text-sm font-extrabold text-slate-500 transition-colors hover:bg-blue-50 hover:text-blue-700 [&.router-link-active]:bg-blue-50 [&.router-link-active]:text-blue-700"
        to="/players"
      >Players</NuxtLink>
      <NuxtLink
        class="rounded-full px-3.5 py-2 text-sm font-extrabold text-slate-500 transition-colors hover:bg-blue-50 hover:text-blue-700 [&.router-link-active]:bg-blue-50 [&.router-link-active]:text-blue-700"
        to="/blog"
      >Blog</NuxtLink>
      <NuxtLink
        class="rounded-full px-3.5 py-2 text-sm font-extrabold text-slate-500 transition-colors hover:bg-blue-50 hover:text-blue-700 [&.router-link-active]:bg-blue-50 [&.router-link-active]:text-blue-700"
        to="/tools"
      >Tools</NuxtLink>
    </nav>
  </header>
</template>
