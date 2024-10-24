import { FastifyInstance, FastifyRequest } from 'fastify'; 
import dayjs from 'dayjs';
import { z } from 'zod';
import { randomUUID } from 'node:crypto';
import { knex } from '../database';
import { authenticateToken } from '../middlewares/jwtAuth';

interface ParamsType {
    id: string;
}

export async function mealsRoutes(app: FastifyInstance) {
    app.addHook('preHandler', async (request) => {
        console.log(`[${request.method} ${request.url}]`);
    });
    
    app.get('/', {
        preHandler: [authenticateToken],
    },  

    async (request) => {
        
        const userId = request.user.id;

        const meals = await knex('meals')
            .select()
            .where('user_id', userId)
            

        return { meals };
    });

    app.post('/', {
        preHandler: [authenticateToken],
    }, 
    async (request, reply) => {
        const createMealBodySchema = z.object({
            name: z.string(),
            description: z.string(),
            mealDate : z.string(),
            isInDiet: z.boolean()
        })

        const { name, description, mealDate, isInDiet } = createMealBodySchema.parse(
            request.body
        )

        const mealDateFromReq = dayjs(mealDate);

        if (!mealDateFromReq.isValid()) {
            return reply.status(400).send({ error: 'Invalid date format. Use YYYY-MM-DD HH:mm.' })
        }

        const formattedMealDate = mealDateFromReq.format('YYYY-MM-DD HH:mm:ss')


        const userId = request.user.id;

        await knex('meals').insert({
            id: randomUUID(),
            user_id: userId,
            name,
            description,
            mealDate: formattedMealDate,
            isInDiet,
        })

        return reply.status(201).send()
    });

    app.get('/:id', {
        preHandler: [authenticateToken],
    },  
    async (request, reply) => {
        
        const { id } = request.params

        const userId = request.user.id;

        const meal = await knex('meals')
            .select()
            .where({
                id: id,
                user_id: userId
            })
            .first();

        if (!meal) {
            return reply.status(404).send({ error: 'Meal not found.' })
        }

        return { meal }



    })

    app.delete('/:id', {
        preHandler: [authenticateToken],
    }, 
    async (request, reply) => {
        
        const { id } = request.params

        const userId = request.user.id;

        const meal = await knex('meals')
            .select()
            .where({
                id: id,
                user_id: userId
            })
            .first();

        if (!meal) {
            return reply.status(404).send({ error: 'Meal not found.' })
        }

        await knex('meals')
        .delete()
        .where('id', id)

        reply.status(204).send();
    })

    app.put('/:id', {
        preHandler: [authenticateToken],
    }, 
    async (request, reply) => {

        
        const { id } = request.params
        
        const userId = request.user.id;

        const meal = await knex('meals')
            .select()
            .where({
                id: id,
                user_id: userId
            })
            .first();

        if (!meal) {
            return reply.status(404).send({ error: 'Meal not found.' })
        }

        const editTransactionBodySchema = z.object({
            name: z.string(),
            description: z.string(),
            mealDate: z.string(),
            isInDiet: z.boolean(),

        })

        const { name, description, mealDate, isInDiet } = editTransactionBodySchema.parse(
            request.body,
        )

        const mealDateFromReq = dayjs(mealDate);

        if (!mealDateFromReq.isValid()) {
            return reply.status(400).send({ error: 'Invalid date format. Use YYYY-MM-DD HH:mm.' });
        }

        const formattedMealDate = mealDateFromReq.format('YYYY-MM-DD HH:mm:ss');

        await knex('meals')
        .where('id', id)
        .update({
            name,
            description,
            mealDate: formattedMealDate,
            isInDiet
        })
        
        return reply.status(204).send()






    })
}

