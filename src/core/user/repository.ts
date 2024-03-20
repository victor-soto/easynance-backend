import { UserEntity } from './entity/user'

export abstract class IUserRepository {
  abstract findOne(params: { username?: string; email?: string }): Promise<UserEntity>
  abstract create(user: UserEntity): Promise<UserEntity>
}
