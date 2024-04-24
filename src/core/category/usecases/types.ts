import { z } from 'zod'

import { CategoryEntity, CategoryEntitySchema } from '../entity/category'

export const CreateCategorySchema = z.object({
  name: z.string(),
  description: z.string().nullish(),
  icon: z.string(),
  iconAltText: z.string().nullish(),
  active: z.boolean().default(true)
})

export const UpdateCategorySchema = CategoryEntitySchema.pick({
  id: true
}).merge(CategoryEntitySchema.omit({ id: true }).partial())

export type CreateCategoryInput = z.infer<typeof CreateCategorySchema>
export type UpdateCategoryOutput = CategoryEntity
export type UpdateCategoryInput = z.infer<typeof UpdateCategorySchema>
