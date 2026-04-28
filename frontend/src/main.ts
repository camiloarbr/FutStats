// @author: Camilo | FutStats
// 1. External imports
import { createApp } from 'vue'

// 2. Internal imports
import App from '@/App.vue'
import '@/assets/css/input.css'
import router from '@/router'
import { createPiniaConfig } from '@/stores/piniaConfig'
import { LocalStorageUtils } from '@/utils/LocalStorageUtils'

const app = createApp(App)
const pinia = createPiniaConfig()

app.use(pinia)

LocalStorageUtils.seed()

app.use(router)
app.mount('#app')
