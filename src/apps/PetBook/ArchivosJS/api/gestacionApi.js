import axiosConfig from './axiosConfig'

export async function obtenerGestacionesPorMascota(mascotaId) {
  const { data } = await axiosConfig.get(`/gestaciones?mascotaId=${mascotaId}&_sort=fechaCruce&_order=desc`)
  return data
}

export async function obtenerGestacionActivaPorMascota(mascotaId) {
  const { data } = await axiosConfig.get(`/gestaciones?mascotaId=${mascotaId}&estado=en_curso&_sort=fechaCruce&_order=desc`)
  return data[0] || null
}

export async function obtenerGestaciones() {
  const { data } = await axiosConfig.get('/gestaciones')
  return data
}

export async function crearGestacionApi(payload) {
  const { data } = await axiosConfig.post('/gestaciones', payload)
  return data
}

export async function actualizarGestacionApi(id, payload) {
  const { data } = await axiosConfig.put(`/gestaciones/${id}`, payload)
  return data
}

export async function patchGestacionApi(id, payload) {
  const { data } = await axiosConfig.patch(`/gestaciones/${id}`, payload)
  return data
}

export async function obtenerCriasPorGestacion(gestacionId) {
  const { data } = await axiosConfig.get(`/crias?gestacionId=${gestacionId}&_sort=numero&_order=asc`)
  return data
}

export async function crearCriaApi(payload) {
  const { data } = await axiosConfig.post('/crias', payload)
  return data
}

export async function actualizarCriaApi(id, payload) {
  const { data } = await axiosConfig.put(`/crias/${id}`, payload)
  return data
}
