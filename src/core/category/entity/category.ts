import { z } from 'zod'

import { BaseEntity } from '@/utils/entity'

export const CategoryEntitySchema = z.object({
  id: z.number().optional(),
  name: z.string(),
  description: z.string().optional(),
  icon: z.string(),
  active: z.boolean().default(true)
})

type Category = z.infer<typeof CategoryEntitySchema>

export class CategoryEntity extends BaseEntity<CategoryEntity>(CategoryEntitySchema) {
  id: number
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
