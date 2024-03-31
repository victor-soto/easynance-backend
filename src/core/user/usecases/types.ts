import { z } from 'zod'

import { CreatedModel } from '@/infra/repository/types'
import { PaginationInput, PaginationOutput, PaginationSchema } from '@/utils/pagination'
import { SearchSchema } from '@/utils/search'
import { SortSchema } from '@/utils/sort'

import { UserEntity, UserEntitySchema } from '../entity/user'

export const CreateUserSchema = z.object({
  username: z.string(),
  password: z.string(),
  email: z.string().email(),
  firstName: z.string(),
  lastName: z.string()
})

export const LoginSchema = z.object({
  username: z.string(),
  password: z.string()
})

export const UpdateUserSchema = UserEntitySchema.pick({
  id: true
}).merge(UserEntitySchema.omit({ id: true }).partial())

export const LogoutSchema = z.object({ token: z.string().trim().min(10) })

export const ListUserSchema = z.intersection(PaginationSchema, SortSchema.merge(SearchSchema))

export type CreateUserInput = z.infer<typeof CreateUserSchema>
export type CreateUserOutput = CreatedModel
export type LoginInput = z.infer<typeof LoginSchema>
export type LoginOutput = { token: string }
export type LogoutInput = z.infer<typeof LogoutSchema>
export type ListUserInput = PaginationInput<UserEntity>
export type ListUserOutput = PaginationOutput<UserEntity>
export type UpdateUserInput = z.infer<typeof UpdateUserSchema>
export type UpdateUserOutput = UserEntity
