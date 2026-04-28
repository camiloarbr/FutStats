// @author: Camilo | FutStats
import { watch } from 'vue'
import { createPinia, type Pinia } from 'pinia'
import { LocalStorageUtils } from '@/utils/LocalStorageUtils'

export function createPiniaConfig(): Pinia {
  const pinia = createPinia()
  let persistedPiniaState = LocalStorageUtils.loadPiniaState()

  if (persistedPiniaState === null) {
    persistedPiniaState = LocalStorageUtils.loadLegacyState()
  }

  if (persistedPiniaState !== null) {
    pinia.state.value = persistedPiniaState
  }

  watch(
    pinia.state,
    (state) => {
      LocalStorageUtils.savePiniaState(state)
    },
    { deep: true }
  )

  return pinia
}
