import { z } from 'zod'

import { BaseEntity } from '@/utils/entity'

export enum CategoryType {
  Income = 'Income',
  Expense = 'Expense'
}

export const CategoryEntitySchema = z.object({
  id: z.number().optional(),
  type: z.nativeEnum(CategoryType),
  name: z.string(),
  description: z.string().nullish(),
  icon: z.string(),
  iconAltText: z.string().nullish(),
  active: z.boolean().default(true)
})

type Category = z.infer<typeof CategoryEntitySchema>

export class CategoryEntity extends BaseEntity<CategoryEntity>(CategoryEntitySchema) {
  id: number
  type: CategoryType
  name: string
  description?: string
  icon: string
  active?: boolean
  iconAltText?: string

  constructor(entity: Category) {
    super()
    Object.assign(this, this.validate(entity))
  }
}
