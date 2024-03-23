import { LoginInput, LoginOutput } from '@/core/user/usecases/types'

export abstract class ILoginAdapter {
  abstract execute(input: LoginInput): Promise<LoginOutput>
}
