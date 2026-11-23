// Consultas del catálogo de destinos como texto GraphQL

export const DESTINOS = `
  query Destinos {
    destinos {
      id
      nombre
      imagen
      pais { nombre }
      actividadesPopulares { id nombre }
    }
  }
`

// Campos de las opciones de un destino; se reutilizan en la consulta de una reserva
export const CAMPOS_OPCIONES = `
  vuelos { id aerolinea horarioIda horarioVuelta precio }
  hoteles { id nombre categoria precioNoche }
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
