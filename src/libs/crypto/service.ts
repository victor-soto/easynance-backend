import * as bcrypt from 'bcrypt'

import { ValidateSchema } from '@/common/decorators/validate-schema.decorator'

import { ICryptoAdapter } from './adapter'
import { CryptoSchema } from './types'

export class CryptoService implements ICryptoAdapter {
  @ValidateSchema(CryptoSchema)
  async createHash(input: string): Promise<string> {
    const saltRounds = 10
    return await bcrypt.hash(input, saltRounds)
  }

  async compareHash(input: string, inputHash: string): Promise<boolean> {
    return await bcrypt.compare(input, inputHash)
  }
}
