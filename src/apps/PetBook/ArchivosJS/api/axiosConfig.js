import axios from 'axios'
import { STORAGE_KEYS } from '../utils/constants'

const axiosConfig = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})

axiosConfig.interceptors.request.use((config) => {
  const token = localStorage.getItem(STORAGE_KEYS.token)

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

axiosConfig.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.message ||
      'Ocurrio un error inesperado al comunicar con PetBook.'

    return Promise.reject(new Error(message))
  },
)

export default axiosConfig
