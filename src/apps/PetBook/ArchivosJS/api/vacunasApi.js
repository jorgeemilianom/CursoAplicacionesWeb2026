import axiosConfig from './axiosConfig'

export async function obtenerVacunasPorMascota(mascotaId) {
  const { data } = await axiosConfig.get(`/vacunas?mascotaId=${mascotaId}`)
  return data
}

export async function obtenerVacunas() {
  const { data } = await axiosConfig.get('/vacunas')
  return data
}

export async function obtenerDesparasitaciones() {
  const { data } = await axiosConfig.get('/desparasitaciones')
  return data
}

export async function crearVacuna(payload) {
  const { data } = await axiosConfig.post('/vacunas', payload)
  return data
}

export async function actualizarVacuna(id, payload) {
  const { data } = await axiosConfig.put(`/vacunas/${id}`, payload)
  return data
}

export async function eliminarVacunaApi(id) {
  await axiosConfig.delete(`/vacunas/${id}`)
}

export async function obtenerDesparasitacionesPorMascota(mascotaId) {
  const { data } = await axiosConfig.get(`/desparasitaciones?mascotaId=${mascotaId}`)
  return data
}

export async function crearDesparasitacion(payload) {
  const { data } = await axiosConfig.post('/desparasitaciones', payload)
  return data
}

export async function actualizarDesparasitacion(id, payload) {
  const { data } = await axiosConfig.put(`/desparasitaciones/${id}`, payload)
  return data
}

export async function eliminarDesparasitacionApi(id) {
  await axiosConfig.delete(`/desparasitaciones/${id}`)
}
