# Contrato REST (v3)

Lo sirve MSW dentro del navegador (`client/src/mocks/handlers.js`). La ruta es relativa a la base
de la app (`import.meta.env.BASE_URL`), por ejemplo `/viajex/api/destinos` en GitHub Pages.

## GET /api/destinos

Listado público del catálogo, en el orden del catálogo (FR-008).

**Respuesta 200** (`application/json`):

```json
[
  {
    "id": "d1",
    "nombre": "Cusco",
    "imagen": "https://picsum.photos/seed/d1/600/400",
    "pais": { "id": "p1", "nombre": "Perú" },
    "actividadesPopulares": [
      { "id": "a1", "nombre": "Visita a Machu Picchu" }
    ]
  }
]
```

- Sin parámetros, paginación ni filtros (búsqueda y filtros están fuera de alcance).
- El detalle (vuelos, hoteles y tours) se consulta por GraphQL: `destino(id)` en
  [schema.graphql](schema.graphql).

**Errores**: cualquier respuesta que no sea 2xx, o un fallo de red, se muestra como "No pudimos
conectar con el servidor. Inténtalo nuevamente." con la opción Reintentar (FR-012, FR-024).
