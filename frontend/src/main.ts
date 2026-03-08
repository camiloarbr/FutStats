// @author: [Name] | FutStats
import './assets/css/input.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { LocalStorageUtils } from '@/utils/LocalStorageUtils'

LocalStorageUtils.seed()

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.mount('#app')
