import { z } from 'zod'

import { PermissionEntitySchema } from '@/core/permission/entity/permission'

export const RoleEntitySchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string().optional(),
  active: z.boolean(),
  permissions: z.array(PermissionEntitySchema)
})

export type Role = z.infer<typeof RoleEntitySchema>
