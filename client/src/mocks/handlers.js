import { http, graphql as graphqlMsw, HttpResponse } from 'msw'
import { graphql } from 'graphql'
import { makeExecutableSchema } from '@graphql-tools/schema'
import { addMocksToSchema } from '@graphql-tools/mock'
import { typeDefs } from './schema.js'
import { crearStore, crearResolvers, listadoDestinos } from './resolvers.js'

// Esquema base + store en memoria + resolvers propios sobre el store
const base = makeExecutableSchema({ typeDefs })
const store = crearStore(base)
const esquema = addMocksToSchema({ schema: base, store, resolvers: crearResolvers(store) })

// Endpoints simulados: REST para el listado y GraphQL para el resto (convención de MSW)
export const handlers = [
  http.get('*/api/destinos', () => HttpResponse.json(listadoDestinos())),
  graphqlMsw.operation(async ({ query, variables }) =>
    HttpResponse.json(await graphql({ schema: esquema, source: query, variableValues: variables })),
  ),
]
