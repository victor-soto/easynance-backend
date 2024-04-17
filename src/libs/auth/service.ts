import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'

import { IPermissionRepository } from '@/core/permission/repository'
import { ISecretAdapter } from '@/infra/secrets'

import { ITokenAdapter } from './adapter'
import { JwtType, SignInput, SignOutput } from './types'

@Injectable()
export class TokenService implements ITokenAdapter {
  constructor(
    private readonly jwtService: JwtService,
    private readonly secret: ISecretAdapter,
    private readonly permissionRepository: IPermissionRepository
  ) {}

  sign(model: SignInput): SignOutput {
    return { token: this.jwtService.sign(model) }
  }

  verify(token: string): JwtType {
    return this.jwtService.verify(token, { secret: this.secret.JWT_SECRET_KEY })
  }

  async authorizeRequest(url: string, method: string, decodedToken: JwtType): Promise<boolean> {
    const permissions = await this.permissionRepository.findAllByRoles(decodedToken.roles)
    return permissions.some((permission) => {
      return new RegExp(permission.path).test(url) && permission.method === method
    })
  }
}
