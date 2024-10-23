import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { randomUUID } from 'node:crypto'
import { knex } from '../database'
import bcrypt from 'bcryptjs';
import { authenticateToken } from '../middlewares/jwtAuth';
import { totalmem } from 'node:os';


export async function usersRoutes(app: FastifyInstance) {
    app.addHook('preHandler', async (request) => {
        console.log(`[${request.method} ${request.url}]`)
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

    app.get('/metrics', {
        preHandler: [authenticateToken],
    },  
    async (request, reply) => {
        

        const userId = request.user.id;

        // knex.raw = faz consultas sql brutas(raw sql queries)
        // é util quando devemos escrever algo que não é facilmente
        // expressável com a própria api de construção de query do knex
        const checkMetrics = await knex('meals')
            .select({
                countInDiet: knex.raw('count(case when isInDiet = true then 1 end)'),
                countNotInDiet: knex.raw('count(case when isInDiet = false then 1 end)'),
                totalMeals: knex.raw('count(*)')
            })
            .where('user_id', userId)
            .first();
           
            // exemplo de consulta sql pra ilustrar:
            // CASE
            //     WHEN isInDiet == true THEN 1
            //     ELSE resultado_padrão
            // END

        if (!checkMetrics) {
            return reply.status(404).send({ error: "You don't have any meals registered yet!" })
        }

        const orderedMeals = await knex('meals')
            .select('isInDiet', 'date')

        checkMetrics.inDietMealsPercentage = (checkMetrics.countInDiet /  checkMetrics.totalMeals) * 100

        return reply.send({checkMetrics});

        
                

    })



}


// - Deve ser possível recuperar as métricas de um usuário
//     - Quantidade total de refeições registradas
//     - Quantidade total de refeições dentro da dieta
//     - Quantidade total de refeições fora da dieta




//     - Melhor sequência de refeições dentro da dieta
