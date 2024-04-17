import { Module } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'

import { IPermissionRepository } from '@/core/permission/repository'
import { ISecretAdapter, SecretModule } from '@/infra/secrets'
import { PermissionModule } from '@/modules/permission/module'

import { ITokenAdapter } from './adapter'
import { TokenService } from './service'

@Module({
  imports: [SecretModule, PermissionModule],
  providers: [
    {
      provide: ITokenAdapter,
      useFactory: (secret: ISecretAdapter, permissionRepository: IPermissionRepository) => {
        const jwtService = new JwtService({
          global: true,
          secret: secret.JWT_SECRET_KEY,
          signOptions: { expiresIn: secret.TOKEN_EXPIRATION }
        })
        return new TokenService(jwtService, secret, permissionRepository)
      },
      inject: [ISecretAdapter, IPermissionRepository]
    }
  ],
  exports: [ITokenAdapter]
})
export class TokenModule {}
