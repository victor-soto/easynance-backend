import { ValidateSchema } from '@/common/decorators/validate-schema.decorator'
import { ICacheAdapter } from '@/infra/cache/adapter'
import { ISecretAdapter } from '@/infra/secrets'

import { LogoutInput, LogoutSchema } from './types'

export class LogoutUseCase {
  constructor(
    private readonly secret: ISecretAdapter,
    private readonly cacheService: ICacheAdapter
  ) {}

  @ValidateSchema(LogoutSchema)
  async execute(input: LogoutInput): Promise<void> {
    await this.cacheService.set(input.token, input.token, { PX: this.secret.TOKEN_EXPIRATION })
  }
}
