// @author: Camilo | FutStats
import './assets/css/input.css'
import { createApp, watch } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { LocalStorageUtils } from '@/utils/LocalStorageUtils'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)

const persistedPiniaState = LocalStorageUtils.loadPiniaState()

if (persistedPiniaState !== null) {
	pinia.state.value = persistedPiniaState
}

LocalStorageUtils.seed()

watch(
	pinia.state,
	(state) => {
		LocalStorageUtils.savePiniaState(state)
	},
	{ deep: true },
)

app.use(router)
app.mount('#app')
