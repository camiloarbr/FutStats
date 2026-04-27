// @author: Camilo | FutStats
import '@/assets/css/input.css'
import { createApp, watch } from 'vue'
import { createPinia } from 'pinia'
import App from '@/App.vue'
import router from '@/router'
import { LocalStorageUtils } from '@/utils/LocalStorageUtils'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)

let persistedPiniaState = LocalStorageUtils.loadPiniaState()

// Fallback: if piniaState doesn't exist, try to load from legacy individual keys
if (persistedPiniaState === null) {
  persistedPiniaState = LocalStorageUtils.loadLegacyState()
}

if (persistedPiniaState !== null) {
  pinia.state.value = persistedPiniaState
}

LocalStorageUtils.seed()

watch(
  pinia.state,
  (state) => {
    LocalStorageUtils.savePiniaState(state)
  },
  { deep: true }
)

app.use(router)
app.mount('#app')
