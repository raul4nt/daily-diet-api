import { expect, it, beforeAll, afterAll, describe, beforeEach } from 'vitest'
import request from 'supertest'
import { execSync } from 'node:child_process'
import jwt from 'jsonwebtoken'
import { env } from '../src/env'

import { app } from '../src/app'

const SECRET_KEY = env.JWT_SECRET
const USER_ID = '6b75fe8a-9b30-41a4-bc70-12e44f812af9'

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, SECRET_KEY, { expiresIn: '1h' })
}

describe('Users routes', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  beforeEach(() => {
    execSync('npm run knex migrate:rollback --all')
    execSync('npm run knex migrate:latest')
  })

  it('should be able to create a new user', async () => {
    await request(app.server)
      .post('/users')
      //   .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'New user',
        email: 'newuser@mail.com',
        password: 'newuser123',
      })
      .expect(201)
  })

  it('should be able to return user metrics', async () => {
    const token = generateToken(USER_ID)

    await request(app.server)
      .post('/meals')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'New meal',
        description: 'Meal description',
        mealDate: '2024-10-22 22:37',
        isInDiet: true,
      })
      .expect(201)

    await request(app.server)
      .post('/meals')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'New meal again',
        description: 'Meal description again',
        mealDate: '2024-10-24 13:37',
        isInDiet: true,
      })
      .expect(201)

    const checkMetricsResponse = await request(app.server) // Use await aqui
      .get('/users/metrics')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)

    expect(checkMetricsResponse.body.checkMetrics).toEqual(
      expect.objectContaining({
        countInDiet: 2,
        countNotInDiet: 0,
        totalMeals: 2,
        inDietMealsPercentage: 100,
        maxInDietMealsSequence: 2,
      }),
    )
  })
})
