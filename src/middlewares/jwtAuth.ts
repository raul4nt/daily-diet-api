import { FastifyReply, FastifyRequest } from 'fastify'
import jwt from 'jsonwebtoken';

export async function authenticateToken(request: FastifyRequest, reply: FastifyReply){

    const token = request.headers['authorization']?.split(' ')[1];
    // usando o split " " pois a saida é algo assim:
    // Saída: "Bearer eyJhbGciOiJIUzI...(tem mais caracteres, é mt longo)"

    if (!token) return reply.status(401).send({ error: 'Unauthorized.' })

    const secret = process.env.JWT_SECRET;

    if(!secret) {
        return reply.status(500).send({ error: 'Internal Server Error: JWT_SECRET not defined.' })
    }

    jwt.verify(token, secret, (err, user) => {
        // expirou/inválido
        if (err) return reply.status(403).send({ error: "Forbidden." })
            request.user = user
    })

}







// import { FastifyReply, FastifyRequest } from 'fastify';
// import jwt from 'jsonwebtoken';

// export async function authenticateToken(request: FastifyRequest, reply: FastifyReply) {

//     // 1. Extrai o token do cabeçalho Authorization
//     const token = request.headers['authorization']?.split(' ')[1];
//     // O token é esperado no formato: "Bearer <token>"
//     // O método split é usado para separar "Bearer" do token real.

//     // 2. Verifica se o token existe
//     if (!token) return reply.status(401).send({ error: 'Unauthorized.' });
//     // Se o token não existir, retorna 401 Unauthorized.

//     // 3. Verifica o token usando a chave secreta
//     jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
//         if (err) return reply.status(403).send({ error: "Forbidden." });
//         // O jwt.verify valida o token. Se o token for inválido ou expirado, o erro é tratado.
        
//         // 4. Se o token for válido, adiciona o usuário ao request
//         request.user = user; 
//         // Aqui, o "user" é o payload do token, que contém informações sobre o usuário.
//     });
// }