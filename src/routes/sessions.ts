import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { env } from '../env'
import { randomUUID } from 'node:crypto'
import { knex } from '../database'
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';


export async function sessionsRoutes(app: FastifyInstance) {
    app.addHook('preHandler', async (request) => {
        console.log(`[${request.method} ${request.url}]`)
    })
    
    app.post('/login',  async (request, reply) => {
        const loginBodySchema = z.object({
            email: z.string(),
            password: z.string().min(6)
        })

        const { email, password } = loginBodySchema.parse(
            request.body
        )
        
        const user = await knex('users')
        .where('email', email)
        .first()

        if (!user) {
            return reply.status(404).send({ error: 'Credentials not found.' })
        }

        const validPassword = await bcrypt.compare(password, user.password)

        if (!validPassword) {
            return reply.status(404).send({ error: 'Credentials not found.' })
        }

        // const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' })
        const token = jwt.sign({ id: user.id }, env.JWT_SECRET, { expiresIn: '1h' });

        reply.send({ token })
        


    })

// const isPasswordValid = await bcrypt.compare(password, user.password);
//     if (!isPasswordValid) {
//         return reply.status(401).send({ error: 'Invalid password' });
//     }

//     const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
//     reply.send({ token });

}
