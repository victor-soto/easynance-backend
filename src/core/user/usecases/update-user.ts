import { ValidateSchema } from '@/common/decorators/validate-schema.decorator'
import { ICryptoAdapter } from '@/libs/crypto'
import { ApiConflictException, ApiNotFoundException } from '@/utils/exception'

import { UserEntity } from '../entity/user'
import { IUserRepository } from '../repository'
import { UpdateUserInput, UpdateUserOutput, UpdateUserSchema } from './types'

export class UpdateUserUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly crypto: ICryptoAdapter
  ) {}

  @ValidateSchema(UpdateUserSchema)
  async execute(input: UpdateUserInput): Promise<UpdateUserOutput> {
    const user = await this.userRepository.findById(input.id)

    if (!user) throw new ApiNotFoundException('User not found')

    const userEntity = new UserEntity({ ...user, ...input })

    const userExists = await this.userRepository.existsOnUpdate(
      { username: userEntity.username },
      { id: userEntity.id }
    )
    if (userExists) throw new ApiConflictException('User already exists')
    const password = await this.crypto.createHash(input.password)
    userEntity.password = password
    await this.userRepository.updateOne({ id: userEntity.id }, userEntity)
    const updated = await this.userRepository.findById(userEntity.id)
    const userUpdated = new UserEntity(updated)
    userUpdated.anonymizePassword()
    return userUpdated
  }
}
