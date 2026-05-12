<template>
  <div class="grid gap-6">
    <section class="grid gap-6 md:grid-cols-2">
      <div
        class="rounded-lg bg-gradient-to-br from-slate-900 via-blue-700 to-cyan-600 p-[clamp(1.5rem,4vw,2.5rem)] text-white shadow-[0_28px_70px_rgba(15,23,42,0.22)]"
      >
        <p class="text-xs font-black uppercase tracking-[0.18em] text-white/70">Proyecto Hibrido</p>
        <h1 class="my-3 max-w-[13ch] text-[clamp(2rem,6vw,4.2rem)] font-black leading-none">FutStats mini dashboard en Nuxt</h1>
        <p class="m-0 max-w-[46rem] text-white/80">
          Una version compacta enfocada en jugadores, articulos de analisis y herramientas ligeras para leer rendimiento futbolistico.
        </p>
        <div class="mt-5 flex flex-wrap gap-3">
          <NuxtLink
            class="inline-flex min-h-[2.75rem] items-center justify-center rounded-full bg-white px-4 font-black text-blue-700"
            to="/players"
          >Ver players</NuxtLink>
          <NuxtLink
            class="inline-flex min-h-[2.75rem] items-center justify-center rounded-full border border-white/40 px-4 font-black text-white"
            to="/blog"
          >Leer blog</NuxtLink>
        </div>
      </div>

      <div
        class="grid gap-4 rounded-lg border border-slate-200 bg-white p-4 shadow-md"
        aria-label="Resumen FutStats"
      >
        <div class="relative min-h-52 overflow-hidden rounded-lg bg-gradient-to-br from-emerald-700 to-green-500">
          <span class="absolute left-1/2 top-1/2 h-[5.4rem] w-[5.4rem] -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white/60" />
          <span class="absolute left-1/2 top-0 h-full w-0.5 bg-white/60" />
        </div>
        <div class="grid gap-3">
          <StatTile label="Render players" tone="green" value="SSR" />
          <StatTile label="Blog" tone="cyan" value="SSG" />
          <StatTile label="Tools" tone="blue" value="CSR" />
        </div>
      </div>
    </section>

    <section class="grid gap-4 sm:grid-cols-3">
      <NuxtLink
        class="grid gap-2.5 rounded-lg border border-slate-200 bg-white p-5 shadow-md transition hover:-translate-y-0.5 hover:border-blue-300"
        to="/players"
      >
        <span class="text-[0.78rem] font-black uppercase tracking-wider text-blue-700">SSR</span>
        <h2 class="m-0 text-[1.2rem] font-black leading-tight text-slate-900">Players</h2>
        <p class="m-0 text-slate-500">Listado y detalle de jugadores servidos desde la capa server de Nuxt.</p>
      </NuxtLink>
      <NuxtLink
        class="grid gap-2.5 rounded-lg border border-slate-200 bg-white p-5 shadow-md transition hover:-translate-y-0.5 hover:border-blue-300"
        to="/blog"
      >
        <span class="text-[0.78rem] font-black uppercase tracking-wider text-blue-700">SSG</span>
        <h2 class="m-0 text-[1.2rem] font-black leading-tight text-slate-900">Blog</h2>
        <p class="m-0 text-slate-500">Tres articulos quemados en codigo y prerenderizados como contenido estatico.</p>
      </NuxtLink>
      <NuxtLink
        class="grid gap-2.5 rounded-lg border border-slate-200 bg-white p-5 shadow-md transition hover:-translate-y-0.5 hover:border-blue-300"
        to="/tools"
      >
        <span class="text-[0.78rem] font-black uppercase tracking-wider text-blue-700">CSR</span>
        <h2 class="m-0 text-[1.2rem] font-black leading-tight text-slate-900">Tools</h2>
        <p class="m-0 text-slate-500">Calculadora y FAQ renderizadas en el cliente para interacciones simples.</p>
      </NuxtLink>
    </section>
  </div>
</template>
