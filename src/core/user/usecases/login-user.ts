import { ValidateSchema } from '@/common/decorators/validate-schema.decorator'
import { ITokenAdapter } from '@/libs/auth'
import { ICryptoAdapter } from '@/libs/crypto'

import { IUserRepository } from '../repository'
import { LoginInput, LoginOutput, LoginSchema } from './types'

export class LoginUseCase {
  constructor(
    private readonly repository: IUserRepository,
    private readonly tokenService: ITokenAdapter,
    private readonly crypto: ICryptoAdapter
  ) {}

  @ValidateSchema(LoginSchema)
  async execute(input: LoginInput): Promise<LoginOutput> {
    const login = await this.repository.findLogin(input.username)
    if (!login) throw new Error('Login failed')
    const passwordMatch = await this.crypto.compareHash(input.password, login.password)
    if (!passwordMatch) throw new Error('Login failed')
    return this.tokenService.sign({ email: login.email, username: login.username })
  }
}
