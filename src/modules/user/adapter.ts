import { UserCreateInput, UserCreateOutput } from '@/core/user/usecases/types'

export abstract class ICreateUserAdapter {
  abstract execute(input: UserCreateInput): Promise<UserCreateOutput>
}
