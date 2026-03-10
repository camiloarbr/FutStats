// @author: Victor Chavez | FutStats
<script setup lang="ts">
// Individual team representation
interface TeamSide {
  name: string
  score: number
  badge: string
}

// Combined scoreboard payload
interface ScoreboardData {
  home: TeamSide
  away: TeamSide
  stadium: string
}

// Highlight chips displayed under venue
interface HighlightMetric {
  label: string
  value: string
  tone: 'emerald' | 'sky'
}

// Scoreboard hero props
const props = defineProps<{
  scoreboard: ScoreboardData
  formattedDate: string
  highlights: HighlightMetric[]
}>()
</script>

<template>
  <div class="scoreboard-hero">
    <div class="scoreboard-hero__content">
      <div class="scoreboard-hero__teams">
        <div class="team-card">
          <div class="team-badge">
            <img :src="props.scoreboard.home.badge" :alt="props.scoreboard.home.name" />
          </div>
          <p class="team-label">Home</p>
          <h3>{{ props.scoreboard.home.name }}</h3>
        </div>

        <div class="score-value">
          <p>Full Time</p>
          <div>
            <span>{{ props.scoreboard.home.score }}</span>
            <span>:</span>
            <span>{{ props.scoreboard.away.score }}</span>
          </div>
          <p class="score-date">{{ props.formattedDate }}</p>
        </div>

        <div class="team-card">
          <div class="team-badge">
            <img :src="props.scoreboard.away.badge" :alt="props.scoreboard.away.name" />
          </div>
          <p class="team-label">Away</p>
          <h3>{{ props.scoreboard.away.name }}</h3>
        </div>
      </div>

      <div class="scoreboard-hero__details">
        <p class="details-label">Venue</p>
        <p class="details-stadium">{{ props.scoreboard.stadium }}</p>
        <div class="details-metrics">
          <div
            v-for="metric in props.highlights"
            :key="metric.label"
            class="metric-card"
            :class="[`metric-card--${metric.tone}`]"
          >
            <p>{{ metric.label }}</p>
            <span>{{ metric.value }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="scoreboard-hero__blob scoreboard-hero__blob--one"></div>
    <div class="scoreboard-hero__blob scoreboard-hero__blob--two"></div>
  </div>
</template>

<style scoped>
.scoreboard-hero {
  position: relative;
  overflow: hidden;
  border-radius: 1.5rem;
  background: linear-gradient(140deg, #0f172a, #1e3a8a, #22d3ee);
  padding: 2rem;
  color: #fff;
  box-shadow: 0 40px 90px rgba(15, 23, 42, 0.45);
}

.scoreboard-hero__content {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

@media (min-width: 1024px) {
  .scoreboard-hero__content {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    gap: 2.5rem;
  }
}

.scoreboard-hero__teams {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

@media (min-width: 640px) {
  .scoreboard-hero__teams {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
}

.team-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  text-align: center;
}

.team-badge {
  width: 80px;
  height: 80px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.12);
  border: 1px solid rgba(255, 255, 255, 0.2);
  display: grid;
  place-items: center;
  padding: 0.75rem;
  backdrop-filter: blur(4px);
}

.team-badge img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.team-label {
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.3em;
  color: rgba(255, 255, 255, 0.7);
  font-weight: 600;
}

.score-value {
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.score-value > p:first-child {
  text-transform: uppercase;
  letter-spacing: 0.4em;
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.65);
}

.score-value > div {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: 800;
  letter-spacing: -0.05em;
}

.score-date {
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.7);
}

.scoreboard-hero__details {
  flex: 1;
  border-radius: 1.25rem;
  border: 1px solid rgba(255, 255, 255, 0.25);
  background: rgba(255, 255, 255, 0.12);
  padding: 1.25rem;
  backdrop-filter: blur(6px);
}

.details-label {
  text-transform: uppercase;
  letter-spacing: 0.4em;
  font-size: 0.7rem;
  color: rgba(255, 255, 255, 0.65);
  font-weight: 600;
}

.details-stadium {
  font-size: 1.125rem;
  font-weight: 600;
}

.details-metrics {
  margin-top: 1rem;
  display: grid;
  gap: 0.75rem;
}

@media (min-width: 768px) {
  .details-metrics {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

.metric-card {
  border-radius: 1rem;
  padding: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.3);
  background: rgba(255, 255, 255, 0.1);
}

.metric-card p {
  font-size: 0.65rem;
  text-transform: uppercase;
  letter-spacing: 0.35em;
  color: rgba(255, 255, 255, 0.65);
}

.metric-card span {
  display: block;
  margin-top: 0.4rem;
  font-size: 1.35rem;
  font-weight: 800;
}

.metric-card--emerald {
  color: #6ee7b7;
}

.metric-card--sky {
  color: #7dd3fc;
}

.scoreboard-hero__blob {
  position: absolute;
  border-radius: 999px;
  filter: blur(110px);
  opacity: 0.35;
  pointer-events: none;
  animation: scoreboardPulse 18s ease-in-out infinite;
}

.scoreboard-hero__blob--one {
  width: 420px;
  height: 420px;
  bottom: -140px;
  right: -60px;
  background: radial-gradient(circle, rgba(14, 165, 233, 0.7), transparent 65%);
}

.scoreboard-hero__blob--two {
  width: 360px;
  height: 360px;
  top: -120px;
  left: -90px;
  background: radial-gradient(circle, rgba(59, 130, 246, 0.7), transparent 60%);
  animation-delay: 6s;
}

@keyframes scoreboardPulse {
  0% {
    transform: scale(0.9);
    opacity: 0.3;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.45;
  }
  100% {
    transform: scale(0.95);
    opacity: 0.3;
  }
}
</style>
