import { FastifyReply, FastifyRequest } from 'fastify'
import jwt from 'jsonwebtoken'
import { env } from '../env'

export async function authenticateToken(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const token = request.headers.authorization?.split(' ')[1]
  // usando o split " " pois a saida é algo assim:
  // Saída: "Bearer eyJhbGciOiJIUzI...(tem mais caracteres, é mt longo)"

  if (!token) return reply.status(401).send({ error: 'Unauthorized.' })

  const secret = env.JWT_SECRET

  jwt.verify(token, secret, (err, user) => {
    // expirou/inválido
    if (err) return reply.status(403).send({ error: 'Forbidden.' })
    request.user = user
  })
}
