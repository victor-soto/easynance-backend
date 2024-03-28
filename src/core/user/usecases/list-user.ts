import { ValidateSchema } from '@/common/decorators/validate-schema.decorator'

import { UserEntity } from '../entity/user'
import { IUserRepository } from '../repository'
import { ListUserInput, ListUserOutput, ListUserSchema } from './types'

export class ListUserUseCase {
  constructor(private readonly repository: IUserRepository) {}

  @ValidateSchema(ListUserSchema)
  async execute(input: ListUserInput): Promise<ListUserOutput> {
    const users = await this.repository.paginate(input)
    return {
      items: users.items.map((u) => {
        const model = new UserEntity(u)
        model.anonymizePassword()

        return model
      }),
      limit: users.limit,
      page: users.page,
      total: users.total
    }
  }
}
