import { Module } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'

import { ISecretAdapter, SecretModule } from '@/infra/secrets'

import { ITokenAdapter } from './adapter'
import { TokenService } from './service'

@Module({
  imports: [SecretModule],
  providers: [
    {
      provide: ITokenAdapter,
      useFactory: (secret: ISecretAdapter) => {
        const jwtService = new JwtService({
          global: true,
          secret: secret.JWT_SECRET_KEY,
          signOptions: { expiresIn: secret.TOKEN_EXPIRATION }
        })
        return new TokenService(jwtService)
      },
      inject: [ISecretAdapter]
    }
  ],
  exports: [ITokenAdapter]
})
export class TokenModule {}
