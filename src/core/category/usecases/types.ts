import { z } from 'zod'

import { PaginationInput, PaginationOutput, PaginationSchema } from '@/utils/pagination'
import { SearchSchema } from '@/utils/search'
import { SortSchema } from '@/utils/sort'

import { CategoryEntity, CategoryEntitySchema } from '../entity/category'

export const CreateCategorySchema = CategoryEntitySchema.pick({
  name: true,
  type: true,
  icon: true,
  iconAltText: true,
  active: true,
  description: true
}).strict()

export const UpdateCategorySchema = CategoryEntitySchema.pick({
  id: true
})
  .merge(CategoryEntitySchema.omit({ id: true }).partial())
  .strict()

export const DeleteCategorySchema = CategoryEntitySchema.pick({
  id: true
})

export const ListCategorySchema = z.intersection(PaginationSchema, SortSchema.merge(SearchSchema))

export const GetCategoryByIdSchema = CategoryEntitySchema.pick({
  id: true
})

export type CreateCategoryInput = z.infer<typeof CreateCategorySchema>
export type UpdateCategoryOutput = CategoryEntity
export type UpdateCategoryInput = z.infer<typeof UpdateCategorySchema>
export type DeleteCategoryOutput = CategoryEntity
export type DeleteCategoryInput = z.infer<typeof DeleteCategorySchema>
export type ListCategoryInput = PaginationInput<CategoryEntity>
export type ListCategoryOutput = PaginationOutput<CategoryEntity>
export type GetCategoryByIdInput = z.infer<typeof GetCategoryByIdSchema>
export type GetCategoryByIdOutput = CategoryEntity
