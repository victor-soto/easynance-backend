import { z } from 'zod'

import { PaginationInput, PaginationOutput, PaginationSchema } from '@/utils/pagination'
import { SearchSchema } from '@/utils/search'
import { SortSchema } from '@/utils/sort'

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

export const DeleteCategorySchema = CategoryEntitySchema.pick({
  id: true
})

export const ListCategorySchema = z.intersection(PaginationSchema, SortSchema.merge(SearchSchema))

export type CreateCategoryInput = z.infer<typeof CreateCategorySchema>
export type UpdateCategoryOutput = CategoryEntity
export type UpdateCategoryInput = z.infer<typeof UpdateCategorySchema>
export type DeleteCategoryOutput = CategoryEntity
export type DeleteCategoryInput = z.infer<typeof DeleteCategorySchema>
export type ListCategoryInput = PaginationInput<CategoryEntity>
export type ListCategoryOutput = PaginationOutput<CategoryEntity>
