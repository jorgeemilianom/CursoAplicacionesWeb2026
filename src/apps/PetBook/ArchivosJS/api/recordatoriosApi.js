import axiosConfig from './axiosConfig'

export async function obtenerRecordatoriosPorUsuario(usuarioId) {
  const { data } = await axiosConfig.get(`/recordatorios?usuarioId=${usuarioId}&_sort=fecha&_order=asc`)
  return data
}

export async function obtenerRecordatoriosPorMascota(mascotaId) {
  const { data } = await axiosConfig.get(`/recordatorios?mascotaId=${mascotaId}&_sort=fecha&_order=asc`)
  return data
}

export async function crearRecordatorioApi(payload) {
  const { data } = await axiosConfig.post('/recordatorios', payload)
  return data
}

export async function editarRecordatorioApi(id, payload) {
  const { data } = await axiosConfig.put(`/recordatorios/${id}`, payload)
  return data
}

export async function eliminarRecordatorioApi(id) {
  await axiosConfig.delete(`/recordatorios/${id}`)
}

export async function marcarRecordatorioCompletadoApi(id, payload) {
  const { data } = await axiosConfig.patch(`/recordatorios/${id}`, payload)
  return data
}
