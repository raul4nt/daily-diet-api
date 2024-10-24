import 'fastify';

declare module 'fastify' {
    interface FastifyRequest {
        user?: any; // Tente definir um tipo mais específico para user
        params: {
            id: string; // Adicione a interface Params aqui diretamente
        };
    }

    interface CheckMetrics {
        countInDiet: number;
        countNotInDiet: number;
        totalMeals: number;
        inDietMealsPercentage?: number; // Opcional
        maxInDietMealsSequence?: number; // Opcional
    }
}
