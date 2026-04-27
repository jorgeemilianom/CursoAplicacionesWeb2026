import axiosConfig from './axiosConfig'

export async function obtenerConsultasPorMascota(mascotaId) {
  const { data } = await axiosConfig.get(`/consultas?mascotaId=${mascotaId}&_sort=fecha&_order=desc`)
  return data
}

export async function obtenerConsultas() {
  const { data } = await axiosConfig.get('/consultas?_sort=fecha&_order=asc')
  return data
}

export async function crearConsulta(payload) {
  const { data } = await axiosConfig.post('/consultas', payload)
  return data
}

export async function actualizarConsulta(id, payload) {
  const { data } = await axiosConfig.put(`/consultas/${id}`, payload)
  return data
}

export async function eliminarConsultaApi(id) {
  await axiosConfig.delete(`/consultas/${id}`)
}

export async function obtenerNotasSaludPorMascota(mascotaId) {
  const { data } = await axiosConfig.get(`/notasSalud?mascotaId=${mascotaId}&_sort=fecha&_order=desc`)
  return data
}

export async function crearNotaSalud(payload) {
  const { data } = await axiosConfig.post('/notasSalud', payload)
  return data
}

export async function eliminarNotaSaludApi(id) {
  await axiosConfig.delete(`/notasSalud/${id}`)
}
