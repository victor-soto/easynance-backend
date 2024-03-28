import { JwtService } from '@nestjs/jwt'

import { ISecretAdapter } from '@/infra/secrets'

import { ITokenAdapter } from './adapter'
import { JwtType, SignInput, SignOutput } from './types'

export class TokenService implements ITokenAdapter {
  constructor(
    private readonly jwtService: JwtService,
    private readonly secret: ISecretAdapter
  ) {}

  sign(model: SignInput): SignOutput {
    return { token: this.jwtService.sign(model) }
  }

  verify(token: string): Promise<JwtType> {
    return this.jwtService.verifyAsync(token, { secret: this.secret.JWT_SECRET_KEY })
  }
}
