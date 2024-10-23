import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable('meals', (table) => {
        table.uuid('id').primary()
        table.uuid('user_id').notNullable()
        table.text('name').notNullable()
        table.text('description').notNullable()
        table.timestamp('mealDate').notNullable()
        table.boolean('isInDiet').notNullable()

    })
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable('meals')
}

