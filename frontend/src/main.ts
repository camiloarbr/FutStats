// @author: Camilo | FutStats
import '@/assets/css/input.css'
import { createApp } from 'vue'
import App from '@/App.vue'
import router from '@/router'
import { createPiniaConfig } from '@/stores/piniaConfig'
import { LocalStorageUtils } from '@/utils/LocalStorageUtils'

const app = createApp(App)
const pinia = createPiniaConfig()

app.use(pinia)

LocalStorageUtils.seed()

app.use(router)
app.mount('#app')
