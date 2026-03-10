// @author: Camilo | FutStats
<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  title: string
  value: string | number
  icon?: string
  color?: 'primary' | 'accent' | 'secondary'
}

const props = withDefaults(defineProps<Props>(), {
  color: 'primary',
})

const colorMap = {
  primary: '#1a56db',
  accent: '#16bdca',
  secondary: '#1e2a3b',
}

const resolvedColor = computed((): string => colorMap[props.color ?? 'primary'])
</script>

<template>
  <div class="bg-white rounded-xl shadow-sm p-6 flex items-center gap-4 border border-gray-100">
    <!-- icon -->
    <div
      class="w-12 h-12 rounded-full flex items-center justify-center text-white text-xl"
      :style="{ backgroundColor: resolvedColor }"
    >
      <i v-if="props.icon" :class="props.icon"></i>
    </div>
    <!-- content -->
    <div>
      <p class="text-sm text-gray-500 font-medium">{{ props.title }}</p>
      <p class="text-2xl font-bold text-gray-800">{{ props.value }}</p>
    </div>
  </div>
</template>
