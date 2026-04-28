// @author: Camilo | FutStats
// 1. External imports
import { createApp } from 'vue'

// 2. Internal imports
import App from '@/App.vue'
import '@/assets/css/input.css'
import router from '@/router'
import { AuthService } from '@/services/AuthService'
import { FutStatsDataService } from '@/services/FutStatsDataService'
import { createPiniaConfig } from '@/stores/piniaConfig'

const app = createApp(App)
const pinia = createPiniaConfig()

app.use(pinia)

AuthService.restoreSession()

try {
  await FutStatsDataService.loadInitialData()
} catch (error) {
  console.error('Unable to load FutStats data from the back-end.', error)
}

app.use(router)
app.mount('#app')
