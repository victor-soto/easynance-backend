import { Request } from 'express'

import { JwtType } from '@/libs/auth/types'

export function extractTokenFromHeader(request: Request): string | undefined {
  const [type, token] = request.headers.authorization?.split(' ') ?? []
  return type === 'Bearer' ? token : undefined
}

export interface ApiRequest<TReq> {
  readonly body: TReq
  readonly user: JwtType
}
