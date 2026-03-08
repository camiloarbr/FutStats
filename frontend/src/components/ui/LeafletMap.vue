// @author: [Name] | FutStats
<script setup lang="ts">
import { onMounted, onUnmounted, watch, ref } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'

delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
})

interface Props {
  lat: number
  lng: number
  stadiumName: string
}

const props = defineProps<Props>()

// Map instance ref
const mapInstance = ref<L.Map | null>(null)
const markerId = `map-${Math.random().toString(36).slice(2, 9)}`

// Initialize map
function initMap(): void {
  if (mapInstance.value) {
    mapInstance.value.remove()
    mapInstance.value = null
  }
  const map = L.map(markerId).setView([props.lat, props.lng], 15)
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors',
  }).addTo(map)
  L.marker([props.lat, props.lng])
    .addTo(map)
    .bindPopup(props.stadiumName)
    .openPopup()
  mapInstance.value = map
}

// Lifecycle
onMounted((): void => {
  initMap()
})

onUnmounted((): void => {
  if (mapInstance.value) {
    mapInstance.value.remove()
    mapInstance.value = null
  }
})

// Watch for prop changes
watch(
  () => [props.lat, props.lng],
  (): void => {
    initMap()
  }
)
</script>

<template>
  <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
    <h3 class="text-base font-semibold text-gray-700 mb-3">
      <i class="fas fa-location-dot mr-2 text-blue-500"></i>
      {{ props.stadiumName }}
    </h3>
    <div
      :id="markerId"
      class="w-full rounded-lg overflow-hidden"
      style="height: 350px; z-index: 0;"
    ></div>
  </div>
</template>
