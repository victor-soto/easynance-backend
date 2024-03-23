import { JwtService } from '@nestjs/jwt'

import { ITokenAdapter } from './adapter'
import { SignInput, SignOutput } from './types'

export class TokenService implements ITokenAdapter {
  constructor(private readonly jwtService: JwtService) {}

  sign(model: SignInput): SignOutput {
    return { token: this.jwtService.sign(model) }
  }
}
