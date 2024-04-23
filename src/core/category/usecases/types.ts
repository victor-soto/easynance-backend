import { z } from 'zod'

export const CreateCategorySchema = z.object({
  name: z.string(),
  description: z.string().nullish(),
  icon: z.string(),
  iconAltText: z.string().nullish(),
  active: z.boolean().default(true)
})

export type CreateCategoryInput = z.infer<typeof CreateCategorySchema>
