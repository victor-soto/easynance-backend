import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { Request } from 'express'

import { ITokenAdapter } from '@/libs/auth'

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
    const token = this.extractTokenFromHeader(request)
    if (!token) {
      throw new Error('Token is not present')
    }
    try {
      const payload = this.tokenService.verify(token)
      request['user'] = payload
    } catch {
      throw new Error('Unauthorized')
    }
    return true
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? []
    return type === 'Bearer' ? token : undefined
  }
}
