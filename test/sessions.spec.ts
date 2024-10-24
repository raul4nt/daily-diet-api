import { expect, it, beforeAll, afterAll, describe, beforeEach } from 'vitest'
import request from 'supertest'
import { execSync } from 'node:child_process'
import jwt from 'jsonwebtoken'
import { env } from '../src/env'

import { app } from '../src/app'

describe('Sessions routes', () => {
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

  it('should be able to authenticate a user', async () => {
    await request(app.server)
      .post('/users')
      //   .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'New user',
        email: 'newuser@mail.com',
        password: 'newuser123',
      })
      .expect(201)

    await request(app.server)
      .post('/sessions/login')
      .send({
        email: 'newuser@mail.com',
        password: 'newuser123',
      })
      .expect(200)
  })
})
