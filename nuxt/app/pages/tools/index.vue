<template>
  <section class="grid gap-6">
    <header
      class="rounded-lg bg-gradient-to-br from-slate-900 via-blue-700 to-cyan-600 p-[clamp(1.5rem,4vw,2.5rem)] text-white shadow-[0_28px_70px_rgba(15,23,42,0.22)]"
    >
      <p class="text-xs font-black uppercase tracking-[0.18em] text-white/70">Tools CSR</p>
      <h1 class="my-3 max-w-[16ch] text-[clamp(2rem,5vw,3.15rem)] font-black leading-none">Herramientas FutStats</h1>
      <p class="m-0 max-w-[46rem] text-white/80">
        Utilidades ligeras para calcular participacion directa y resolver dudas de la entrega.
      </p>
    </header>

    <section class="grid gap-4 sm:grid-cols-2">
      <NuxtLink
        class="grid gap-2.5 rounded-lg border border-slate-200 bg-white p-5 shadow-md transition hover:-translate-y-0.5 hover:border-blue-300"
        to="/tools/calculadora"
      >
        <span class="text-[0.78rem] font-black uppercase tracking-wider text-blue-700">Calculadora</span>
        <h2 class="m-0 text-[1.2rem] font-black leading-tight text-slate-900">Participacion directa</h2>
        <p class="m-0 text-slate-500">Calcula goles mas asistencias y promedio por partido.</p>
      </NuxtLink>
      <NuxtLink
        class="grid gap-2.5 rounded-lg border border-slate-200 bg-white p-5 shadow-md transition hover:-translate-y-0.5 hover:border-blue-300"
        to="/tools/faq"
      >
        <span class="text-[0.78rem] font-black uppercase tracking-wider text-blue-700">FAQ</span>
        <h2 class="m-0 text-[1.2rem] font-black leading-tight text-slate-900">Preguntas frecuentes</h2>
        <p class="m-0 text-slate-500">Resumen de renderizado para blog, players y tools.</p>
      </NuxtLink>
    </section>
  </section>
</template>
