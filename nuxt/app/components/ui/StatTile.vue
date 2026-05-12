<script setup lang="ts">
interface Props {
  label: string
  tone?: 'blue' | 'cyan' | 'green' | 'slate'
  value: string | number
}

withDefaults(defineProps<Props>(), {
  tone: 'blue',
})
</script>

<template>
  <article class="stat-tile" :class="`stat-tile--${tone}`">
    <span>{{ label }}</span>
    <strong>{{ value }}</strong>
  </article>
</template>
