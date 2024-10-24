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

describe('Meals routes', () => {
  let token

  beforeAll(async () => {
    await app.ready()
    token = generateToken(USER_ID)
  })

  afterAll(async () => {
    await app.close()
  })

  beforeEach(() => {
    execSync('npm run knex migrate:rollback --all')
    execSync('npm run knex migrate:latest')
  })

  it('should be able to create a new meal', async () => {
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

    // dar uma olhadinha nesse
  })

  it('should be able to list all meals', async () => {
    await request(app.server)
      .post('/meals')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'New meal',
        description: 'Meal description',
        mealDate: '2024-10-22 22:37',
        isInDiet: true,
      })

    const listMealsResponse = await request(app.server)
      .get('/meals')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)

    expect(listMealsResponse.body.meals).toEqual([
      expect.objectContaining({
        name: 'New meal',
        description: 'Meal description',
        mealDate: '2024-10-22 22:37:00',
        isInDiet: 1,
      }),
    ])
  })

  it('should be able to get a specific meal', async () => {
    await request(app.server)
      .post('/meals')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'New meal',
        description: 'Meal description',
        mealDate: '2024-10-22 22:37',
        isInDiet: true,
      })

    const listMealsResponse = await request(app.server)
      .get('/meals')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)

    const mealId = listMealsResponse.body.meals[0].id

    const getMealResponse = await request(app.server)
      .get(`/meals/${mealId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200)

    expect(getMealResponse.body.meal).toEqual(
      expect.objectContaining({
        name: 'New meal',
        description: 'Meal description',
        mealDate: '2024-10-22 22:37:00',
        isInDiet: 1,
      }),
    )
  })

  it('should be able to delete a specific meal', async () => {
    await request(app.server)
      .post('/meals')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'New meal',
        description: 'Meal description',
        mealDate: '2024-10-22 22:37',
        isInDiet: true,
      })

    const listMealsResponse = await request(app.server)
      .get('/meals')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)

    const mealId = listMealsResponse.body.meals[0].id

    await request(app.server)
      .delete(`/meals/${mealId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(204)
  })

  it('should be able to edit a specific meal', async () => {
    await request(app.server)
      .post('/meals')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'New meal',
        description: 'Meal description',
        mealDate: '2024-10-22 22:37',
        isInDiet: true,
      })

    const listMealsResponse = await request(app.server)
      .get('/meals')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)

    const mealId = listMealsResponse.body.meals[0].id

    await request(app.server)
      .put(`/meals/${mealId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Edited meal',
        description: 'Edited meal description',
        mealDate: '2024-10-22 15:40',
        isInDiet: false,
      })
      .expect(204)

    const getMealResponse = await request(app.server)
      .get(`/meals/${mealId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200)

    expect(getMealResponse.body.meal).toEqual(
      expect.objectContaining({
        name: 'Edited meal',
        description: 'Edited meal description',
        mealDate: '2024-10-22 15:40:00',
        isInDiet: 0,
      }),
    )
  })
})
