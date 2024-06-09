import { z } from 'zod'

import { BudgetEntitySchema } from '../entity/budget'

export const CreateBudgetSchema = BudgetEntitySchema.pick({
  type: true
})
  .extend({
    month: z.number().min(1).max(12),
    year: z
      .number()
      .min(new Date().getFullYear() - 1)
      .max(new Date().getFullYear() + 1),
    userId: z.number().nullish()
  })
  .strict()

export type CreateBudgetInput = z.infer<typeof CreateBudgetSchema>
