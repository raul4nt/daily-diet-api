import { Knex } from 'knex'

declare module 'knex/types/tables' {
  export interface Tables {
    users: {
      id: string
      email: string
      name: string
      password: string
      created_at: string
    }

    meals: {
      id: string
      user_id: string
      name: string
      description: string
      mealDate: string
      isInDiet: boolean
    }
  }
}
