import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'

import { ITokenAdapter } from '@/libs/auth'
import { extractTokenFromHeader } from '@/utils/request'

import { IS_PUBLIC_KEY } from '../decorators/public.decorator'

@Injectable()
export class AuthGuardInterceptor implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly tokenService: ITokenAdapter
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass()
    ])
    if (isPublic) return true
    const request = context.switchToHttp().getRequest()
    const token = extractTokenFromHeader(request)
    if (!token) {
      return false
    }
    try {
      const payload = this.tokenService.verify(token)
      request['user'] = payload
    } catch {
      return false
    }
    return true
  }
}
