// @author: Victor Chavez | FutStats
<script setup lang="ts"></script>

<template>
  <section class="space-y-8">
    <header class="admin-hub-hero">
      <p class="hero-chip">Admin Center</p>
      <h1>Tools Hub</h1>
      <p>Choose a domain to manage teams, players, or matches in dedicated admin workspaces.</p>
    </header>

    <div class="hub-grid">
      <RouterLink :to="{ name: 'admin.teams' }" class="hub-card">
        <p class="hub-label">Teams</p>
        <h2>Manage Teams</h2>
        <span>Create, edit, and delete club records.</span>
      </RouterLink>

      <RouterLink :to="{ name: 'admin.players' }" class="hub-card">
        <p class="hub-label">Players</p>
        <h2>Manage Players</h2>
        <span>Control player profiles and club assignments.</span>
      </RouterLink>

      <RouterLink :to="{ name: 'admin.matches' }" class="hub-card">
        <p class="hub-label">Matches</p>
        <h2>Manage Matches</h2>
        <span>Register and maintain fixtures.</span>
      </RouterLink>
    </div>
  </section>
</template>

<style scoped>
.admin-hub-hero {
  border-radius: 1.75rem;
  background: linear-gradient(120deg, #0f172a, #1d4ed8, #22d3ee);
  padding: 2rem;
  color: #fff;
  box-shadow: 0 35px 80px rgba(15, 23, 42, 0.35);
}

.hero-chip {
  text-transform: uppercase;
  letter-spacing: 0.35em;
  font-size: 0.7rem;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.7);
}

.admin-hub-hero h1 {
  font-size: clamp(2rem, 4vw, 2.8rem);
  font-weight: 800;
}

.admin-hub-hero p {
  color: rgba(255, 255, 255, 0.9);
  max-width: 36rem;
}

.hub-grid {
  display: grid;
  gap: 1rem;
}

@media (min-width: 768px) {
  .hub-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

.hub-card {
  border-radius: 1.5rem;
  border: 1px solid rgba(15, 23, 42, 0.08);
  background: #fff;
  box-shadow: 0 25px 70px rgba(15, 23, 42, 0.08);
  padding: 1.5rem;
  display: block;
  text-decoration: none;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.hub-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 30px 80px rgba(15, 23, 42, 0.15);
}

.hub-label {
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.3em;
  color: #64748b;
}

.hub-card h2 {
  font-size: 1.3rem;
  font-weight: 700;
  color: #0f172a;
}

.hub-card span {
  color: #475569;
}
</style>