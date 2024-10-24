import { expect, it, beforeAll, afterAll, describe, beforeEach } from 'vitest'
import request from 'supertest'
import { execSync } from 'node:child_process'

import { app } from '../src/app'

describe('Meals routes', () => {
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

  it('should be able to create a new meal', async () => {
    await request(app.server)
      .post('/meals')
      .send({
        name: 'New meal',
        description: 'Meal description',
        mealDate: '2024-10-22 22:37',
        isInDiet: true,
      })
      .expect(201)

    //   const token = jwt.sign({ id: user.id }, env.JWT_SECRET, { expiresIn: '1h' });
  })

  it('should be able to list all meals', async () => {
    await request(app.server)
      .post('/meals')
      .send({
        name: 'New meal',
        description: 'Meal description',
        mealDate: '2024-10-22 22:37',
        isInDiet: true,
      })

    const listMealsResponse = await request(app.server)
      .get('/meals')
      .expect(200)

    expect(listMealsResponse.body.meals).toEqual([
      expect.objectContaining({
        name: 'New meal',
        description: 'Meal description',
        mealDate: '2024-10-22 22:37',
        isInDiet: true,
      }),
    ])
  })

  it('should be able to get a specific meal', async () => {
    await request(app.server)
      .post('/meals')
      .send({
        name: 'New meal',
        description: 'Meal description',
        mealDate: '2024-10-22 22:37',
        isInDiet: true,
      })

    const listMealsResponse = await request(app.server)
      .get('/meals')
      .expect(200)

    const mealId = listMealsResponse.body.meals[0].id

    const getMealResponse = await request(app.server)
      .get(`/meals/${mealId}`)
      .expect(200)

    expect(getMealResponse.body.transaction).toEqual(
      expect.objectContaining({
        name: 'New meal',
        description: 'Meal description',
        mealDate: '2024-10-22 22:37',
        isInDiet: true,
      })
    )
  })

  it('should be able to delete a specific meal', async () => {
    await request(app.server)
      .post('/meals')
      .send({
        name: 'New meal',
        description: 'Meal description',
        mealDate: '2024-10-22 22:37',
        isInDiet: true,
      })

    const listMealsResponse = await request(app.server)
      .get('/meals')
      .expect(200)

    const mealId = listMealsResponse.body.meals[0].id

    await request(app.server)
      .delete(`/meals/${mealId}`)
      .expect(204)
  })

  it('should be able to edit a specific meal', async () => {
    await request(app.server)
      .post('/meals')
      .send({
        name: 'New meal',
        description: 'Meal description',
        mealDate: '2024-10-22 22:37',
        isInDiet: true,
      })

    const listMealsResponse = await request(app.server)
      .get('/meals')
      .expect(200)

    const mealId = listMealsResponse.body.meals[0].id
  })

  //   it('should be able to get the summary', async () => {
  //     const createTransactionResponse = await request(app.server)
  //       .post('/transactions')
  //       .send({
  //         title: 'Credit transaction',
  //         amount: 5000,
  //         type: 'credit',
  //       })

  //     const cookies = createTransactionResponse.get('Set-Cookie')

  //     await request(app.server)
  //       .post('/transactions')
  //       .set('Cookie', cookies)
  //       .send({
  //         title: 'Debit transaction',
  //         amount: 2000,
  //         type: 'debit',
  //       })

  //     const summaryResponse = await request(app.server)
  //       .get('/transactions/summary')
  //       .set('Cookie', cookies)
  //       .expect(200)

  //     expect(summaryResponse.body.summary).toEqual({
  //       amount: 3000,
  //     })
  //   })
})
