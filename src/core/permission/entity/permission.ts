import { z } from 'zod'

import { BaseEntity } from '@/utils/entity'

export const PermissionEntitySchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string().nullish(),
  path: z.string(),
  method: z.string(),
  active: z.boolean()
})

export type Permission = z.infer<typeof PermissionEntitySchema>

export class PermissionEntity extends BaseEntity<PermissionEntity>(PermissionEntitySchema) {
  name: string
  description: string
  path: string
  method: string
  active: boolean

  constructor(entity: Permission) {
    super()
    Object.assign(this, this.validate(entity))
  }
}
