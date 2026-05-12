<template>
  <section class="page-stack">
    <header class="page-hero">
      <p class="eyebrow">Tools CSR</p>
      <h1>Herramientas FutStats</h1>
      <p>
        Utilidades ligeras para calcular participacion directa y resolver dudas
        de la entrega.
      </p>
    </header>

    <section class="section-grid">
      <NuxtLink class="content-card route-card" to="/tools/calculadora">
        <span>Calculadora</span>
        <h2>Participacion directa</h2>
        <p>Calcula goles mas asistencias y promedio por partido.</p>
      </NuxtLink>
      <NuxtLink class="content-card route-card" to="/tools/faq">
        <span>FAQ</span>
        <h2>Preguntas frecuentes</h2>
        <p>Resumen de renderizado para blog, players y tools.</p>
      </NuxtLink>
    </section>
  </section>
</template>
