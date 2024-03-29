import { HttpStatus, Injectable, NestMiddleware } from '@nestjs/common'
import { NextFunction, Request, Response } from 'express'
import { v4 as uuidv4 } from 'uuid'

import { ICacheAdapter } from '@/infra/cache/adapter'
import { ITokenAdapter } from '@/libs/auth'
import { extractTokenFromHeader } from '@/utils/request'

@Injectable()
export class IsLoggedMiddleware implements NestMiddleware {
  constructor(
    private readonly redisService: ICacheAdapter,
    private readonly tokenService: ITokenAdapter
  ) {}

  async use(req: Request, res: Response, next: NextFunction): Promise<void> {
    const token = extractTokenFromHeader(req)

    if (!req.headers?.traceId) req.headers.traceId = req['id'] ?? uuidv4()

    if (!token) {
      res.status(HttpStatus.UNAUTHORIZED)
      req['id'] = req.headers.traceId
      throw new Error('no token provided')
    }
    const expiredToken = await this.redisService.get(token)
    if (expiredToken) {
      req['id'] = req.headers.traceId
      throw new Error('you have been logged out')
    }
    try {
      const userDecoded = this.tokenService.verify(token)
      req['user'] = userDecoded
    } catch (error) {
      req['id'] = req.headers.traceId
      error.status = HttpStatus.UNAUTHORIZED
      next(error)
    }
    next()
  }
}
