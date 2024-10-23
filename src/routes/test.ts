import Fastify from 'fastify';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import knex from './db'; // Sua instância do Knex
import { z } from 'zod';

const fastify = Fastify();

// Schema de validação usando Zod
const userSchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6), // Exemplo: senha mínima de 6 caracteres
});

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string(),
});

// Middleware para autenticação com JWT
async function authenticateToken(request, reply) {
    const token = request.headers['authorization']?.split(' ')[1];

    if (!token) return reply.status(401).send({ error: 'Unauthorized' });

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return reply.status(403).send({ error: 'Forbidden' });
        request.user = user; // Adiciona o usuário ao request
    });
}

// Rota para criar um usuário
fastify.post('/users', async (request, reply) => {
    const { name, email, password } = userSchema.parse(request.body);
    const hashedPassword = await bcrypt.hash(password, 10);
    await knex('users').insert({ name, email, password: hashedPassword });
    reply.status(201).send({ message: 'User created successfully' });
});

// Rota para login
fastify.post('/login', async (request, reply) => {
    const { email, password } = loginSchema.parse(request.body);
    const user = await knex('users').where('email', email).first();

    if (!user) {
        return reply.status(404).send({ error: 'User not found' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        return reply.status(401).send({ error: 'Invalid password' });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    reply.send({ token });
});

// Rota para adicionar refeição
fastify.post('/meals', { preHandler: authenticateToken }, async (request, reply) => {
    const { name, description, date, time, isInDiet } = request.body;
    const userId = request.user.id; // Obter o ID do usuário autenticado

    await knex('meals').insert({
        name,
        description,
        date,
        time,
        isInDiet,
        userId // Relacionar a refeição ao usuário
    });

    reply.status(201).send({ message: 'Meal added successfully' });
});

// Iniciar o servidor
fastify.listen(3000, (err, address) => {
    if (err) {
        console.error(err);
        process.exit(1);
    }
    console.log(`Server listening at ${address}`);
});
