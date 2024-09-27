import fastify from 'fastify';
import {
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from 'fastify-type-provider-zod';
import z from 'zod';
import { createGoal } from '../services/create-goal';
import { getWeekPendingGoals } from '../services/get-week-pending-goals';

const app = fastify().withTypeProvider<ZodTypeProvider>();

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.get('/pending-goals', async () => {
  const sql = await getWeekPendingGoals();

  return sql;
});

app.post(
  '/goals',
  {
    schema: {
      body: z.object({
        title: z.string(),
        desiredWeeklyFrequency: z.number().int().min(1).max(7),
      }),
    },
  },
  async request => {
    const { title, desiredWeeklyFrequency } = request.body;

    await createGoal({ title, desiredWeeklyFrequency });
  }
);

app.listen({ port: 3333 }).then(() => {
  console.log('HTTP server running!');
});
