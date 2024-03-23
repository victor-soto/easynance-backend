import { LogoutInput } from '@/core/user/usecases/types'

export abstract class ILogoutAdapter {
  abstract execute(input: LogoutInput): Promise<void>
}
