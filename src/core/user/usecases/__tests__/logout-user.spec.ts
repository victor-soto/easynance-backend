import { faker } from '@faker-js/faker'
import { Test } from '@nestjs/testing'
import { ZodIssue } from 'zod'

import { ICacheAdapter } from '@/infra/cache/adapter'
import { ISecretAdapter, SecretModule } from '@/infra/secrets'
import { ILogoutAdapter } from '@/modules/logout/adapter'
import { expectZodError } from '@/utils/tests'

import { LogoutUseCase } from '../logout-user'

describe('#LogoutUseCase', () => {
  let useCase: ILogoutAdapter
  const cacheServiceMock = {
    set: jest.fn()
  }

  beforeEach(async () => {
    const app = await Test.createTestingModule({
      imports: [SecretModule],
      providers: [
        {
          provide: ICacheAdapter,
          useValue: cacheServiceMock
        },
        {
          provide: ISecretAdapter,
          useValue: {
            TOKEN_EXPIRATION: 3600
          }
        },
        {
          provide: ILogoutAdapter,
          useFactory: (secret: ISecretAdapter, cacheAdapter: ICacheAdapter) => {
            return new LogoutUseCase(secret, cacheAdapter)
          },
          inject: [ISecretAdapter, ICacheAdapter]
        }
      ]
    }).compile()
    useCase = app.get(ILogoutAdapter)
  })

  afterEach(() => jest.clearAllMocks())

  it('when no input is specified, should expect an error', async () => {
    await expectZodError(
      () => useCase.execute({}),
      (issues: ZodIssue[]) => {
        expect(issues).toEqual([{ message: 'Required', path: 'token' }])
      }
    )
  })

  it('when user logout, should expect set token to blacklist', async () => {
    cacheServiceMock.set = jest.fn()
    const token = faker.string.alphanumeric(16)
    await expect(useCase.execute({ token })).resolves.toBeUndefined()
    expect(cacheServiceMock.set).toHaveBeenCalledWith(token, token, { PX: 3600 })
  })
})
