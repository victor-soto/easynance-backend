import {
  CreateUserInput,
  CreateUserOutput,
  DeleteUserInput,
  DeleteUserOutput,
  ListUserInput,
  ListUserOutput,
  UpdateUserInput,
  UpdateUserOutput
} from '@/core/user/usecases/types'

export abstract class ICreateUserAdapter {
  abstract execute(input: CreateUserInput): Promise<CreateUserOutput>
}

export abstract class IListUserAdapter {
  abstract execute(input: ListUserInput): Promise<ListUserOutput>
}

export abstract class IUpdateUserAdapter {
  abstract execute(input: UpdateUserInput): Promise<UpdateUserOutput>
}

export abstract class IDeleteUserAdapter {
  abstract execute(input: DeleteUserInput): Promise<DeleteUserOutput>
}
