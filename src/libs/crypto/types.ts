import { z } from 'zod'

export const CryptoSchema = z.string().min(1)
export type CreateHashInput = z.infer<typeof CryptoSchema>
export type CreateHashOutput = string
