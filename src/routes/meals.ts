import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { randomUUID } from 'node:crypto'
import { knex } from '../database'

export async function mealsRoutes(app: FastifyInstance) {
    app.addHook('preHandler', async (request) => {
        console.log(`[${request.method} ${request.url}]`)
      })
    
    app.get('/', async(request) => {
        const meals = await knex('meals')
          .select()
        
        return { meals }
    })

}