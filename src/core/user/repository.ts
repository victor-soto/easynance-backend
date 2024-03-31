import { Transaction } from 'sequelize'

import { CreatedModel, UpdatedModel } from '@/infra/repository/types'
import { DatabaseOptionsType, SaveOptionsType } from '@/utils/sequelize'

import { UserEntity } from './entity/user'
import { ListUserInput, ListUserOutput } from './usecases/types'

export abstract class IUserRepository {
  abstract findByUsernameOrEmail(username: string, email: string, options?: DatabaseOptionsType): Promise<UserEntity>
  abstract findLogin(usernameOrEmail: string, options?: DatabaseOptionsType): Promise<UserEntity>
  abstract findById(id: number, options?: DatabaseOptionsType): Promise<UserEntity>
  abstract create(user: UserEntity, saveOptions?: SaveOptionsType): Promise<CreatedModel>
  abstract startTransaction<T = Transaction>(): Promise<T>
  abstract paginate(input: ListUserInput, options?: DatabaseOptionsType): Promise<ListUserOutput>
  abstract existsOnUpdate(
    equalFilter: Pick<UserEntity, 'username'>,
    notEqualFilter: Pick<UserEntity, 'id'>
  ): Promise<boolean>
  abstract updateOne<TQuery = Partial<UserEntity>, TUpdate = Partial<UserEntity>, TOpts = DatabaseOptionsType>(
    filter: TQuery,
    updated: TUpdate,
    options?: TOpts
  ): Promise<UpdatedModel>
}
