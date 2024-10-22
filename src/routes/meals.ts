import { FastifyInstance } from 'fastify'; 
import dayjs from 'dayjs';
import { z } from 'zod';
import { randomUUID } from 'node:crypto';
import { knex } from '../database';

export async function mealsRoutes(app: FastifyInstance) {
    app.addHook('preHandler', async (request) => {
        console.log(`[${request.method} ${request.url}]`);
    });
    
    app.get('/', async (request) => {
        const meals = await knex('meals').select();

        return { meals };
    });

    app.post('/', async (request, reply) => {
        const createMealBodySchema = z.object({
            name: z.string(),
            description: z.string(),
            date: z.string(),
            time: z.string(),
            isInDiet: z.boolean(),
        })

        const { name, description, date, time, isInDiet } = createMealBodySchema.parse(
            request.body
        )

        const dateFromReq = dayjs(date);

        if (!dateFromReq.isValid()) {
            return reply.status(400).send({ error: 'Invalid date format. Use YYYY-MM-DD.' })
        }

        const formattedDate = dateFromReq.format('YYYY-MM-DD')

        const [hours, minutes] = time.split(':').map(Number);
        if (isNaN(hours) || isNaN(minutes) || hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
            return reply.status(400).send({ error: 'Invalid time format. Use HH:MM.' })
        }

        const formattedTime = dayjs().set('hour', hours).set('minute', minutes).set('second', 0).format('HH:mm:ss')

        await knex('meals').insert({
            id: randomUUID(),
            user_id: randomUUID(),
            name,
            description,
            date: formattedDate,
            time : formattedTime,
            isInDiet,
        })

        return reply.status(201).send()
    });
}
