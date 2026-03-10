// @author: [Name] | FutStats
<script setup lang="ts">
// Environment metadata for footer copy
const appName = import.meta.env.VITE_APP_NAME as string
const appVersion = import.meta.env.VITE_APP_VERSION as string
</script>

<template>
  <footer class="bg-gray-800 p-4 text-center text-white">
    <p class="text-sm font-medium">{{ appName }} v{{ appVersion }}</p>
    <p class="mt-1 text-xs text-gray-300">&copy; 2025 FutStats. All rights reserved.</p>
  </footer>
</template>
