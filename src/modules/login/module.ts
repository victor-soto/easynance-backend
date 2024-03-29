import { Module } from '@nestjs/common'

import { IUserRepository } from '@/core/user/repository'
import { LoginUseCase } from '@/core/user/usecases/login-user'
import { RedisCacheModule } from '@/infra/cache/redis'
import { ITokenAdapter, TokenModule } from '@/libs/auth'
import { CryptoLibModule, ICryptoAdapter } from '@/libs/crypto'

import { UserModule } from '../user/module'
import { ILoginAdapter } from './adapter'
import { LoginController } from './controller'

@Module({
  imports: [UserModule, TokenModule, CryptoLibModule, RedisCacheModule],
  providers: [
    {
      provide: ILoginAdapter,
      useFactory: (repository: IUserRepository, tokenService: ITokenAdapter, crypto: ICryptoAdapter) => {
        return new LoginUseCase(repository, tokenService, crypto)
      },
      inject: [IUserRepository, ITokenAdapter, ICryptoAdapter]
    }
  ],
  controllers: [LoginController]
})
export class LoginModule {}
