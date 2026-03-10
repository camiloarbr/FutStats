// @author: Victor Chavez | FutStats
<script setup lang="ts">
interface SummaryStat {
  id: string
  label: string
  value: string
  helper: string
  accent: string
}

const props = defineProps<{
  summaryStats: SummaryStat[]
}>()
</script>

<template>
  <div
    class="matches-hero"
  >
    <div class="matches-hero__content">
      <div class="matches-hero__intro">
        <p class="intro-label">Season Intelligence</p>
        <div>
          <h2 class="intro-title">Matches Overview</h2>
          <p class="intro-summary">
            Keep an eye on form, intensity, and goals with a live dashboard that adapts to every
            filter you apply.
          </p>
        </div>
        <div class="intro-tags">
          <span class="intro-tag">
            <span class="intro-dot intro-dot--emerald"></span>
            Synced with season data
          </span>
          <span class="intro-tag">
            <span class="intro-dot intro-dot--sky"></span>
            Admin visibility
          </span>
        </div>
      </div>

      <div class="matches-hero__stats">
        <dl>
          <div
            v-for="(stat, index) in props.summaryStats"
            :key="stat.id"
            class="matches-stat"
            :style="{ animationDelay: `${index * 120}ms` }"
          >
            <div class="matches-stat__bg" :class="[`bg-gradient-to-br`, stat.accent]"></div>
            <div class="matches-stat__content">
              <dt>{{ stat.label }}</dt>
              <dd>{{ stat.value }}</dd>
              <p>{{ stat.helper }}</p>
            </div>
          </div>
        </dl>
      </div>
    </div>

    <div class="matches-hero__blob matches-hero__blob--one"></div>
    <div class="matches-hero__blob matches-hero__blob--two"></div>
  </div>
</template>

<style scoped>
.matches-hero {
  position: relative;
  overflow: hidden;
  border-radius: 1.5rem;
  background: linear-gradient(125deg, #0f172a, #1d4ed8, #22d3ee);
  padding: 2rem;
  color: #fff;
  box-shadow: 0 40px 80px rgba(15, 23, 42, 0.35);
}

.matches-hero__content {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

@media (min-width: 1024px) {
  .matches-hero__content {
    gap: 2rem;
  }
}

@media (min-width: 1280px) {
  .matches-hero__content {
    flex-direction: row;
    align-items: flex-start;
    justify-content: space-between;
    gap: 2.5rem;
  }

  .matches-hero__intro,
  .matches-hero__stats {
    flex: 1 1 360px;
  }
}

.matches-hero__intro {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-width: 36rem;
}

.intro-label {
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.3em;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.65);
}

.intro-title {
  font-size: clamp(2rem, 5vw, 2.75rem);
  font-weight: 800;
  line-height: 1.1;
}

.intro-summary {
  margin-top: 0.5rem;
  color: rgba(255, 255, 255, 0.78);
}

.intro-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.78);
}

.intro-tag {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.4rem 0.75rem;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.12);
}

.intro-dot {
  width: 0.6rem;
  height: 0.6rem;
  border-radius: 999px;
}

.intro-dot--emerald {
  background: #6ee7b7;
}

.intro-dot--sky {
  background: #7dd3fc;
}

.matches-hero__stats {
  flex: 1;
  min-width: 0;
}

.matches-hero__stats dl {
  display: grid;
  gap: 1rem;
}

@media (min-width: 640px) {
  .matches-hero__stats dl {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

.matches-stat {
  position: relative;
  border-radius: 1.25rem;
  padding: 1.25rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 15px 35px rgba(15, 23, 42, 0.25);
  overflow: hidden;
  opacity: 0;
  transform: translateY(16px) scale(0.98);
  animation: matchesFade 0.7s ease forwards;
}

.matches-stat__bg {
  position: absolute;
  inset: 0;
  opacity: 0.85;
}

.matches-stat__content {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.matches-stat__content dt {
  font-size: 0.7rem;
  letter-spacing: 0.35em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.75);
  font-weight: 600;
}

.matches-stat__content dd {
  font-size: 1.75rem;
  font-weight: 800;
}

.matches-stat__content p {
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.88);
}

.matches-hero__blob {
  position: absolute;
  width: 320px;
  height: 320px;
  border-radius: 999px;
  filter: blur(80px);
  opacity: 0.35;
  pointer-events: none;
  animation: heroBlob 18s ease-in-out infinite;
}

.matches-hero__blob--one {
  bottom: -120px;
  right: -40px;
  background: radial-gradient(circle, rgba(56, 189, 248, 0.8), transparent 70%);
}

.matches-hero__blob--two {
  top: -80px;
  left: -60px;
  background: radial-gradient(circle, rgba(14, 165, 233, 0.7), transparent 65%);
  animation-delay: 6s;
}

@keyframes matchesFade {
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes heroBlob {
  0% {
    transform: scale(0.9);
    opacity: 0.25;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.4;
  }
  100% {
    transform: scale(0.95);
    opacity: 0.3;
  }
}
</style>
