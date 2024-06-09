import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'

import { IPermissionRepository } from '@/core/permission/repository'
import { ISecretAdapter } from '@/infra/secrets'

import { ITokenAdapter } from '../adapter'
import { TokenService } from '../service'

describe('TokenService', () => {
  let service: ITokenAdapter
  const permissionRepoMock = {
    findAllByRoles: jest.fn()
  }

  beforeEach(async () => {
    const app = await Test.createTestingModule({
      providers: [
        {
          provide: JwtService,
          useValue: {}
        },
        {
          provide: ISecretAdapter,
          useValue: {}
        },
        {
          provide: IPermissionRepository,
          useValue: permissionRepoMock
        },
        {
          provide: ITokenAdapter,
          useFactory: (jwtService: JwtService, secret: ISecretAdapter, permissionRepository: IPermissionRepository) => {
            return new TokenService(jwtService, secret, permissionRepository)
          },
          inject: [JwtService, ISecretAdapter, IPermissionRepository]
        }
      ]
    }).compile()
    service = app.get<ITokenAdapter>(ITokenAdapter)
  })

  afterEach(() => jest.clearAllMocks())

  describe('#authorizeRequest', () => {
    it('when user has permission, should return true', async () => {
      permissionRepoMock.findAllByRoles.mockResolvedValueOnce([{ path: '/users', method: 'GET' }])
      const result = await service.authorizeRequest('/users', 'GET', { roles: [1] })
      expect(result).toBe(true)
    })

    it('when user has not permission, should return false', async () => {
      permissionRepoMock.findAllByRoles.mockResolvedValueOnce([])
      const result = await service.authorizeRequest('/users', 'GET', { roles: [1] })
      expect(result).toBe(false)
    })
  })
})
