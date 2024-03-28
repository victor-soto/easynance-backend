import { CreateUserInput, CreateUserOutput, ListUserInput, ListUserOutput } from '@/core/user/usecases/types'

export abstract class ICreateUserAdapter {
  abstract execute(input: CreateUserInput): Promise<CreateUserOutput>
}

export abstract class IListUserAdapter {
  abstract execute(input: ListUserInput): Promise<ListUserOutput>
}
