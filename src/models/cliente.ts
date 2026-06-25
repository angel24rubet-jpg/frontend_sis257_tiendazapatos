export interface Cliente {
  id: number
  nombre: string
  apellido?: string
  cedula?: string
  telefono?: string
  direccion?: string
}

export interface ClienteDTO {
  nombre: string
  apellido?: string
  cedula?: string
  telefono?: string
  direccion?: string
}
