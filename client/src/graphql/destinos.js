// Consultas de un destino como texto GraphQL; el listado se obtiene por REST

// Campos de las opciones de un destino; se reutilizan en la consulta de una reserva
export const CAMPOS_OPCIONES = `
  vuelos { id aerolinea horarioIda horarioVuelta fechaIda fechaVuelta cupos precio }
  hoteles { id nombre categoria disponibleDesde disponibleHasta habitacionesDisponibles precioNoche }
  tours { id nombre precio actividades { id nombre } }
`

export const DESTINO = `
  query Destino($id: ID!) {
    destino(id: $id) {
      id
      nombre
      imagen
      pais { nombre }
      ${CAMPOS_OPCIONES}
    }
  }
`
