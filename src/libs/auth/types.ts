import { z } from 'zod'

import { UserEntitySchema } from '@/core/user/entity/user'

const SignInputSchema = UserEntitySchema.pick({
  email: true,
  username: true
})

export type SignOutput = {
  token: string
}

export type SignInput = z.infer<typeof SignInputSchema>
