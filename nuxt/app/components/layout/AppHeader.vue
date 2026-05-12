<template>
  <header class="app-header">
    <NuxtLink class="brand-link" to="/">
      <span class="brand-mark">FS</span>
      <span class="brand-copy">
        <strong>FutStats</strong>
        <small>Nuxt edition</small>
      </span>
    </NuxtLink>

    <nav class="main-nav" aria-label="Navegacion principal">
      <NuxtLink to="/players">Players</NuxtLink>
      <NuxtLink to="/blog">Blog</NuxtLink>
      <NuxtLink to="/tools">Tools</NuxtLink>
    </nav>
  </header>
</template>
