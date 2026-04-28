// @author: Camilo | FutStats
// 1. External imports
import axios from 'axios'

// 2. Internal imports
import { AuthStorage } from '@/utils/AuthStorage'

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000/api',
})

apiClient.interceptors.request.use((config) => {
  const accessToken = AuthStorage.getAccessToken()

  if (accessToken !== null) {
    config.headers.Authorization = `Bearer ${accessToken}`
  }

  return config
})
