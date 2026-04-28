// @author: Victor Chavez | FutStats
<script setup lang="ts"></script>

<template>
  <section class="space-y-8">
    <header
      class="rounded-[1.75rem] bg-gradient-to-br from-[#0f172a] via-[#1d4ed8] to-[#22d3ee] p-8 text-white shadow-[0_35px_80px_rgba(15,23,42,0.35)]"
    >
      <p class="text-[0.7rem] font-bold uppercase tracking-[0.35em] text-white/70">Admin Center</p>
      <h1 class="text-[clamp(2rem,4vw,2.8rem)] font-extrabold">Tools Hub</h1>
      <p class="max-w-[36rem] text-white/90">
        Choose a domain to manage teams, players, or matches in dedicated admin workspaces.
      </p>
    </header>

    <div class="grid gap-4 md:grid-cols-3">
      <RouterLink
        :to="{ name: 'admin.teams' }"
        class="block rounded-[1.5rem] border border-slate-900/[0.08] bg-white p-6 no-underline shadow-[0_25px_70px_rgba(15,23,42,0.08)] transition-[transform,box-shadow] duration-200 ease-in-out hover:-translate-y-0.5 hover:shadow-[0_30px_80px_rgba(15,23,42,0.15)]"
      >
        <p class="text-xs uppercase tracking-[0.3em] text-slate-500">Teams</p>
        <h2 class="text-[1.3rem] font-bold text-slate-900">Manage Teams</h2>
        <span class="text-slate-600">Create, edit, and delete club records.</span>
      </RouterLink>

      <RouterLink
        :to="{ name: 'admin.players' }"
        class="block rounded-[1.5rem] border border-slate-900/[0.08] bg-white p-6 no-underline shadow-[0_25px_70px_rgba(15,23,42,0.08)] transition-[transform,box-shadow] duration-200 ease-in-out hover:-translate-y-0.5 hover:shadow-[0_30px_80px_rgba(15,23,42,0.15)]"
      >
        <p class="text-xs uppercase tracking-[0.3em] text-slate-500">Players</p>
        <h2 class="text-[1.3rem] font-bold text-slate-900">Manage Players</h2>
        <span class="text-slate-600">Control player profiles and club assignments.</span>
      </RouterLink>

      <RouterLink
        :to="{ name: 'admin.matches' }"
        class="block rounded-[1.5rem] border border-slate-900/[0.08] bg-white p-6 no-underline shadow-[0_25px_70px_rgba(15,23,42,0.08)] transition-[transform,box-shadow] duration-200 ease-in-out hover:-translate-y-0.5 hover:shadow-[0_30px_80px_rgba(15,23,42,0.15)]"
      >
        <p class="text-xs uppercase tracking-[0.3em] text-slate-500">Matches</p>
        <h2 class="text-[1.3rem] font-bold text-slate-900">Manage Matches</h2>
        <span class="text-slate-600">Register and maintain fixtures.</span>
      </RouterLink>
    </div>
  </section>
</template>
