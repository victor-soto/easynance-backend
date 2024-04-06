import { ValidateSchema } from '@/common/decorators/validate-schema.decorator'
import { ApiNotFoundException } from '@/utils/exception'

import { UserEntity } from '../entity/user'
import { IUserRepository } from '../repository'
import { DeleteUserInput, DeleteUserOutput, DeleteUserSchema } from './types'

export class DeleteUserUseCase {
  constructor(private userRepository: IUserRepository) {}

  @ValidateSchema(DeleteUserSchema)
  async execute({ id }: DeleteUserInput): Promise<DeleteUserOutput> {
    const entity = await this.userRepository.findById(id)

    if (!entity) throw new ApiNotFoundException('User not found')

    const user = new UserEntity(entity)
    user.active = false

    await this.userRepository.updateOne({ id: user.id }, user)
    user.anonymizePassword()
    return user
  }
}
