import { ValidateSchema } from '@/common/decorators/validate-schema.decorator'
import { UserRoleEntity } from '@/core/user-role/entity/user-role'
import { ROLE } from '@/infra/database/postgres/schemas/role'
import { UserRoleSchema } from '@/infra/database/postgres/schemas/user_role'
import { ICryptoAdapter } from '@/libs/crypto'
import { ApiConflictException } from '@/utils/exception'

import { UserEntity } from '../entity/user'
import { IUserRepository } from '../repository'
import { CreateUserInput, CreateUserOutput, CreateUserSchema } from './types'

export class CreateUserUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly crypto: ICryptoAdapter
  ) {}

  @ValidateSchema(CreateUserSchema)
  async execute(input: CreateUserInput): Promise<CreateUserOutput> {
    const entity = new UserEntity(input)

    const userExists = await this.userRepository.findByUsernameOrEmail(entity.username, entity.email)

    if (userExists) {
      throw new ApiConflictException('User already exists')
    }

    const transaction = await this.userRepository.startTransaction()

    try {
      const password = await this.crypto.createHash(entity.password)
      entity.password = password
      entity.userRoles = [new UserRoleEntity({ userId: entity.id, roleId: ROLE.USER })]
      const user = await this.userRepository.create(entity, { transaction: transaction, include: [UserRoleSchema] })
      await transaction.commit()
      return user
    } catch (err) {
      await transaction.rollback()
      throw err
    }
  }
}
