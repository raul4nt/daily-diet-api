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

    app.get('/:id', async (request, reply) => {
        
        const { id } = request.params

        const meal = await knex('meals')
        .select()
        .where('id', id)
        .first()

        if (!meal) {
            return reply.status(404).send({ error: 'Id not found.' })
        }

        return { meal }



    })

    app.delete('/:id', async (request, reply) => {
        
        const { id } = request.params

        const meal = await knex('meals')
        .select()
        .where('id', id)
        .first()

        if (!meal) {
            return reply.status(404).send({ error: 'Id not found.' })
        }

        const deleteMeal = await knex('meals')
        .delete()
        .where('id', id)

        reply.status(204).send();
    })

    app.put('/:id', async (request, reply) => {
//         - Nome
// - Descrição
// - Data e Hora
// - Está dentro ou não da dieta

        const { id } = request.params

        const meal = await knex('meals')
        .select()
        .where('id', id)
        .first()

        if (!meal) {
            return reply.status(404).send({ error: 'Id not found.' })
        }

        const editTransactionBodySchema = z.object({
            name: z.string(),
            description: z.string(),
            date: z.string(),
            time: z.string(),
            isInDiet: z.boolean(),

        })

        const { name, description, date, time, isInDiet } = editTransactionBodySchema.parse(
            request.body,
        )

        // const meal = await knex('meals')
        // .select()
        // .where('id', id)
        // .first()

        const editMeal = await knex('meals')
        .where('id', id)
        .update({
            name,
            description,
            date,
            time,
            isInDiet
        })
        
        return reply.status(204).send()






    })
}

// CORRIGIR DATES - FORMATAÇÃO