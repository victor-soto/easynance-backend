import { faker } from '@faker-js/faker'
import { Test } from '@nestjs/testing'
import { ZodIssue } from 'zod'

import { ITokenAdapter } from '@/libs/auth/adapter'
import { CryptoLibModule, ICryptoAdapter } from '@/libs/crypto'
import { ILoginAdapter } from '@/modules/login/adapter'
import { ApiNotFoundException } from '@/utils/exception'
import { expectZodError } from '@/utils/tests'

import { UserEntity } from '../../entity/user'
import { IUserRepository } from '../../repository'
import { LoginUseCase } from '../login-user'

describe('#LoginUseCase', () => {
  const userMock = {
    id: faker.number.int(10),
    username: faker.internet.userName(),
    password: faker.internet.password(),
    email: faker.internet.email(),
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    roles: []
  }
  let useCase: ILoginAdapter
  const repositoryMock = {
    findLogin: jest.fn()
  }
  const cryptoMock = {
    compareHash: jest.fn()
  }
  const tokenMock = {
    sign: jest.fn()
  }

  beforeEach(async () => {
    const app = await Test.createTestingModule({
      imports: [CryptoLibModule],
      providers: [
        {
          provide: IUserRepository,
          useValue: repositoryMock
        },
        {
          provide: ITokenAdapter,
          useValue: tokenMock
        },
        {
          provide: ICryptoAdapter,
          useValue: cryptoMock
        },
        {
          provide: ILoginAdapter,
          useFactory: (repository: IUserRepository, token: ITokenAdapter, crypto: ICryptoAdapter) => {
            return new LoginUseCase(repository, token, crypto)
          },
          inject: [IUserRepository, ITokenAdapter, ICryptoAdapter]
        }
      ]
    }).compile()

    useCase = app.get<ILoginAdapter>(ILoginAdapter)
  })

  afterAll(() => {
    jest.clearAllMocks()
  })

  it('when no input is specified, should expect an error', async () => {
    await expectZodError(
      () => useCase.execute({}),
      (issues: ZodIssue[]) => {
        expect(issues).toEqual([
          { message: 'Required', path: UserEntity.nameOf('username') },
          { message: 'Required', path: UserEntity.nameOf('password') }
        ])
      }
    )
  })

  it('when user not found, should expect an error', async () => {
    repositoryMock.findLogin.mockReturnValueOnce(null)
    await expect(useCase.execute({ username: 'user', password: 'password' })).rejects.toThrow(ApiNotFoundException)
  })

  it('when user found, should expect a token', async () => {
    repositoryMock.findLogin.mockReturnValueOnce(userMock)
    cryptoMock.compareHash.mockReturnValueOnce(true)
    tokenMock.sign.mockReturnValueOnce({ token: 'token' })
    await expect(useCase.execute({ username: userMock.username, password: userMock.password })).resolves.toEqual({
      token: 'token'
    })
  })
})
