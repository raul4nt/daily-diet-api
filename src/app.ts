import fastify from 'fastify'
import cookie from '@fastify/cookie'
import { mealsRoutes } from './routes/meals'
import { usersRoutes } from './routes/users'
import { sessionsRoutes } from './routes/sessions'

export const app = fastify()

app.register(cookie)
app.register(mealsRoutes, {
  prefix: 'meals',
})
app.register(usersRoutes, {
  prefix: 'users',
})
app.register(sessionsRoutes, {
  prefix: 'sessions',
})
