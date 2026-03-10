// @author: Victor Chavez | FutStats
<script setup lang="ts">
// Stat comparison payload
interface StatComparison {
  id: string
  label: string
  homeValue: number
  awayValue: number
  unit?: string
}

// Summary card props
const props = defineProps<{
  statComparisons: StatComparison[]
}>()

// Balanced width helper for dual bars
function calculateShare(primaryValue: number, secondaryValue: number): number {
  const total = primaryValue + secondaryValue
  if (total === 0) {
    return 50
  }

  const percentage = (primaryValue / total) * 100
  return Math.min(90, Math.max(10, Math.round(percentage)))
}
</script>

<template>
  <div class="summary-card">
    <p class="summary-chip">Summary</p>
    <h3>Head-to-head breakdown</h3>
    <div class="summary-list">
      <div
        v-for="comparison in props.statComparisons"
        :key="comparison.id"
        class="summary-item"
      >
        <div class="summary-item__label">
          <span>{{ comparison.label }}</span>
          <span>{{ comparison.unit ?? '' }}</span>
        </div>
        <div class="stat-bar">
          <div
            class="stat-bar__fill stat-bar__fill--home"
            :style="{ width: `${calculateShare(comparison.homeValue, comparison.awayValue)}%` }"
          >
            <span>{{ comparison.homeValue }}{{ comparison.unit ?? '' }}</span>
          </div>
          <div
            class="stat-bar__fill stat-bar__fill--away"
            :style="{ width: `${calculateShare(comparison.awayValue, comparison.homeValue)}%` }"
          >
            <span>{{ comparison.awayValue }}{{ comparison.unit ?? '' }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.summary-card {
  border-radius: 1.75rem;
  border: 1px solid rgba(59, 130, 246, 0.15);
  background: rgba(255, 255, 255, 0.9);
  padding: 1.75rem;
  box-shadow: 0 30px 70px rgba(59, 130, 246, 0.15);
}

.summary-chip {
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.3em;
  font-weight: 600;
  color: #3b82f6;
}

.summary-card h3 {
  margin-top: 0.3rem;
  font-size: 1.4rem;
  font-weight: 700;
  color: #0f172a;
}

.summary-list {
  margin-top: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.summary-item__label {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 0.9rem;
  font-weight: 600;
  color: #334155;
}

.summary-item__label span:last-child {
  font-size: 0.75rem;
  color: #94a3b8;
}

.stat-bar {
  margin-top: 0.75rem;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.25rem;
}

.stat-bar__fill {
  position: relative;
  border-radius: 999px;
  padding: 0.4rem 0.75rem;
  font-size: 0.8rem;
  font-weight: 600;
  text-align: center;
  min-width: 2.75rem;
}

.stat-bar__fill span {
  display: inline-block;
  color: currentColor;
}

.stat-bar__fill--home {
  background: linear-gradient(120deg, rgba(37, 99, 235, 0.15), rgba(59, 130, 246, 0.4));
  color: #1d4ed8;
}

.stat-bar__fill--away {
  background: linear-gradient(120deg, rgba(14, 165, 233, 0.2), rgba(14, 165, 233, 0.45));
  color: #0ea5e9;
}
</style>
