import { CreateHashInput, CreateHashOutput } from './types'

export abstract class ICryptoAdapter {
  abstract createHash(input: CreateHashInput): Promise<CreateHashOutput>
}
