import { z } from 'zod'

import { UserEntitySchema } from '@/core/user/entity/user'

const SignInputSchema = UserEntitySchema.pick({
  email: true,
  username: true
}).extend({ roles: z.array(z.number()) })

export const JwtSchema = z.object({
  email: z.string(),
  username: z.string(),
  iat: z.number(),
  exp: z.number(),
  roles: z.array(z.number())
})

export type SignOutput = {
  token: string
}

export type SignInput = z.infer<typeof SignInputSchema>

export type JwtType = z.infer<typeof JwtSchema>
