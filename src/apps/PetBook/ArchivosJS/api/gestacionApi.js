import axiosConfig from './axiosConfig'

export async function obtenerGestacionesPorMascota(mascotaId) {
  const { data } = await axiosConfig.get(`/gestaciones?mascotaId=${mascotaId}`)
  return data
}

export async function obtenerGestaciones() {
  const { data } = await axiosConfig.get('/gestaciones')
  return data
}
