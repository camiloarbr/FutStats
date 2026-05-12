<template>
  <div class="home-stack">
    <section class="hero-section">
      <div class="hero-section__content">
        <p class="eyebrow">Proyecto Hibrido</p>
        <h1>FutStats mini dashboard en Nuxt</h1>
        <p>
          Una version compacta enfocada en jugadores, articulos de analisis y
          herramientas ligeras para leer rendimiento futbolistico.
        </p>
        <div class="action-row">
          <NuxtLink class="primary-button" to="/players">Ver players</NuxtLink>
          <NuxtLink class="secondary-button" to="/blog">Leer blog</NuxtLink>
        </div>
      </div>

      <div class="hero-panel" aria-label="Resumen FutStats">
        <div class="pitch-visual">
          <span class="pitch-visual__circle" />
          <span class="pitch-visual__line" />
        </div>
        <div class="hero-panel__stats">
          <StatTile label="Render players" tone="green" value="SSR" />
          <StatTile label="Blog" tone="cyan" value="SSG" />
          <StatTile label="Tools" tone="blue" value="CSR" />
        </div>
      </div>
    </section>

    <section class="section-grid">
      <NuxtLink class="content-card route-card" to="/players">
        <span>SSR</span>
        <h2>Players</h2>
        <p>
          Listado y detalle de jugadores servidos desde la capa server de Nuxt.
        </p>
      </NuxtLink>
      <NuxtLink class="content-card route-card" to="/blog">
        <span>SSG</span>
        <h2>Blog</h2>
        <p>
          Tres articulos quemados en codigo y prerenderizados como contenido
          estatico.
        </p>
      </NuxtLink>
      <NuxtLink class="content-card route-card" to="/tools">
        <span>CSR</span>
        <h2>Tools</h2>
        <p>
          Calculadora y FAQ renderizadas en el cliente para interacciones
          simples.
        </p>
      </NuxtLink>
    </section>
  </div>
</template>
