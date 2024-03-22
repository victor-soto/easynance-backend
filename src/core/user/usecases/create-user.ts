import { ValidateSchema } from '@/common/decorators/validate-schema.decorator'
import { ICryptoAdapter } from '@/libs/crypto'

import { UserEntity } from '../entity/user'
import { IUserRepository } from '../repository'
import { UserCreateOutput, UserCreateSchema } from './types'

export class CreateUserUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly crypto: ICryptoAdapter
  ) {}

  @ValidateSchema(UserCreateSchema)
  async execute(input: any): Promise<UserCreateOutput> {
    const entity = new UserEntity(input)

    const userExists = await this.userRepository.findByUsernameOrEmail(entity.username, entity.email)

    if (userExists) {
      throw new Error('User already exists')
    }

    const transaction = await this.userRepository.startTransaction()

    try {
      const password = await this.crypto.createHash(entity.password)
      const user = await this.userRepository.create({ ...entity, password: password }, { transaction: transaction })
      await transaction.commit()
      return user
    } catch (err) {
      await transaction.rollback()
      throw err
    }
  }
}
