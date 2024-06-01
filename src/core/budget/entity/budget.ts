import { z } from 'zod'

import { BaseEntity } from '@/utils/entity'

export enum BudgetType {
  Monthly = 'Monthly'
}

export const BudgetEntitySchema = z.object({
  id: z.number().optional(),
  type: z.nativeEnum(BudgetType),
  startDate: z.date(),
  endDate: z.date(),
  userId: z.number()
})

type Budget = z.infer<typeof BudgetEntitySchema>

export class BudgetEntity extends BaseEntity<BudgetEntity>(BudgetEntitySchema) {
  id: number
  type: BudgetType
  startDate: Date
  endDate: Date
  userId: number

  constructor(entity: Budget) {
    super()
    Object.assign(this, this.validate(entity))
  }
}
