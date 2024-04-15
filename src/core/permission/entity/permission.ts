import { z } from 'zod'

export const PermissionEntitySchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string().optional(),
  path: z.string(),
  method: z.string(),
  active: z.boolean()
})

export type Permission = z.infer<typeof PermissionEntitySchema>
