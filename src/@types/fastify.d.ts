import 'fastify'

declare module 'fastify' {
  interface FastifyRequest {
    user?: any //
    params: {
      id: string //
    }
  }

  interface CheckMetrics {
    countInDiet: number
    countNotInDiet: number
    totalMeals: number
    inDietMealsPercentage?: number
    maxInDietMealsSequence?: number
  }
}
