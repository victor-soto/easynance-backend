import { Transaction } from 'sequelize'

import { CreatedModel } from '@/infra/repository/types'
import { DatabaseOptionsType, SaveOptionsType } from '@/utils/sequelize'

import { UserEntity } from './entity/user'

export abstract class IUserRepository {
  abstract findByUsernameOrEmail(username: string, email: string, options?: DatabaseOptionsType): Promise<UserEntity>
  abstract create(user: UserEntity, saveOptions?: SaveOptionsType): Promise<CreatedModel>
  abstract startTransaction<T = Transaction>(): Promise<T>
}
