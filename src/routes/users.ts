import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { randomUUID } from 'node:crypto'
import { knex } from '../database'
import bcrypt from 'bcryptjs';

export async function usersRoutes(app: FastifyInstance) {
    app.addHook('preHandler', async (request) => {
        console.log(`[${request.method} ${request.url}]`)
    })
    
    app.get('/', async (request) => {
        const users = await knex('users')
            .select()
        
        return { users }
    })


    app.post('/', async (request, reply) => {
        const createUserBodySchema = z.object({
            name: z.string(),
            email: z.string().email(),
            password: z.string().min(6)
            // minimo de 6 caracteres
        })

        const { name, email, password } = createUserBodySchema.parse(
            request.body
        )

        const hashedPassword = await bcrypt.hash(password, 10);

        await knex('users').insert({
            id: randomUUID(),
            name,
            email,
            password: hashedPassword,
        })

        return reply.status(201).send()
    });

    app.post('/login', async (request, reply) => {
        const loginBodySchema = z.object({
            email: z.string(),
            password: z.string().min(6)
        })

        const { email, password } = loginBodySchema.parse(
            request.body
        )
        
        const userExists = await knex('users')
        .where('email', email)
        .first()

        if (!userExists) {
            return reply.statusCode(404).send({ error: 'Email not found' })
        }
    })

}

