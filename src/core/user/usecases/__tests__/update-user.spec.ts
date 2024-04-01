import { faker } from '@faker-js/faker'
import { Test } from '@nestjs/testing'
import { ZodIssue } from 'zod'

import { CryptoLibModule, ICryptoAdapter } from '@/libs/crypto'
import { IUpdateUserAdapter } from '@/modules/user/adapter'
import { expectZodError } from '@/utils/tests'

import { UserEntity } from '../../entity/user'
import { IUserRepository } from '../../repository'
import { UpdateUserUseCase } from '../update-user'

describe('#UpdateUserUseCase', () => {
  let useCase: IUpdateUserAdapter
  const userRepoMock = {
    findById: jest.fn(),
    existsOnUpdate: jest.fn(),
    updateOne: jest.fn()
  }
  const userMock = {
    id: faker.number.int(10),
    username: faker.internet.userName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    active: true
  } as UserEntity

  beforeEach(async () => {
    const app = await Test.createTestingModule({
      imports: [CryptoLibModule],
      providers: [
        {
          provide: IUserRepository,
          useValue: userRepoMock
        },
        {
          provide: IUpdateUserAdapter,
          useFactory: (repository: IUserRepository, crypto: ICryptoAdapter) => {
            return new UpdateUserUseCase(repository, crypto)
          },
          inject: [IUserRepository, ICryptoAdapter]
        }
      ]
    }).compile()
    useCase = app.get<IUpdateUserAdapter>(IUpdateUserAdapter)
  })

  beforeAll(() => {
    jest.clearAllMocks()
  })

  it('when no input is specified, should expect an error', async () => {
    await expectZodError(
      () => useCase.execute({}),
      (issues: ZodIssue[]) => {
        expect(issues).toEqual([{ message: 'Required', path: UserEntity.nameOf('id') }])
      }
    )
  })

  it('when user updated successfully, should expect an user that has been updated', async () => {
    userRepoMock.findById.mockReturnValue(userMock)
    userRepoMock.existsOnUpdate.mockReturnValueOnce(null)
    userRepoMock.updateOne.mockReturnValueOnce(null)
    await expect(useCase.execute(userMock)).resolves.toEqual({ ...userMock, password: '**********' })
  })

  it('when user not found, should expect an error', async () => {
    userRepoMock.findById.mockReturnValueOnce(null)
    await expect(useCase.execute(userMock)).rejects.toThrow('User not found')
  })

  it('when user already exists, should expect an error', async () => {
    userRepoMock.findById.mockReturnValueOnce(userMock)
    userRepoMock.existsOnUpdate.mockReturnValueOnce(userMock)
    await expect(useCase.execute(userMock)).rejects.toThrow('User already exists')
  })
})
