import axiosConfig from './axiosConfig'

export async function obtenerMascotasPorUsuario(usuarioId) {
  const { data } = await axiosConfig.get(`/mascotas?usuarioId=${usuarioId}`)
  return data
}

export async function obtenerMascotaPorId(id) {
  const { data } = await axiosConfig.get(`/mascotas/${id}`)
  return data
}

export async function crearMascota(payload) {
  const { data } = await axiosConfig.post('/mascotas', payload)
  return data
}

export async function actualizarMascotaApi(id, payload) {
  const { data } = await axiosConfig.put(`/mascotas/${id}`, payload)
  return data
}

export async function eliminarMascotaApi(id) {
  await axiosConfig.delete(`/mascotas/${id}`)
}
