import { ApolloServer } from '@apollo/server'
import { startStandaloneServer } from '@apollo/server/standalone'
import { makeExecutableSchema } from '@graphql-tools/schema'
import { addMocksToSchema } from '@graphql-tools/mock'
import { typeDefs } from './schema.js'
import { crearStore, crearResolvers } from './mocks.js'

// Esquema base + store en memoria + resolvers propios sobre el store
const esquemaBase = makeExecutableSchema({ typeDefs })
const store = crearStore(esquemaBase)
const schema = addMocksToSchema({ schema: esquemaBase, store, resolvers: crearResolvers(store) })

const servidor = new ApolloServer({ schema })
const { url } = await startStandaloneServer(servidor, { listen: { port: 4000 } })
console.log(`Servidor GraphQL mock listo en ${url}`)
