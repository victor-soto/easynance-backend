import { faker } from '@faker-js/faker'
import { Test } from '@nestjs/testing'

import { ICreateUserAdapter } from '@/modules/user/adapter'

import { IUserRepository } from '../../repository'
import { CreateUserUseCase } from '../create-user'

const userMock = {
  username: faker.internet.userName(),
  password: faker.internet.password(),
  email: faker.internet.email(),
  firstName: faker.person.firstName(),
  lastName: faker.person.lastName()
}

describe('#CreateUserUseCase', () => {
  let useCase: ICreateUserAdapter
  const userRepositoryMock = {
    findByUsernameOrEmail: jest.fn(),
    create: jest.fn(),
    startTransaction: jest.fn().mockResolvedValue({
      commit: jest.fn(),
      rollback: jest.fn()
    })
  }

  beforeEach(async () => {
    const app = await Test.createTestingModule({
      providers: [
        {
          provide: IUserRepository,
          useValue: userRepositoryMock
        },
        {
          provide: ICreateUserAdapter,
          useFactory: (userRepository: IUserRepository) => {
            return new CreateUserUseCase(userRepository)
          },
          inject: [IUserRepository]
        }
      ]
    }).compile()

    useCase = app.get(ICreateUserAdapter)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('when user created successfully, should expect an user that has been created', async () => {
    userRepositoryMock.findByUsernameOrEmail.mockResolvedValueOnce(null)
    userRepositoryMock.create.mockResolvedValueOnce({ id: faker.number.int(10), created: true })
    const createdUser = await useCase.execute(userMock)
    expect(createdUser).toHaveProperty('id')
    expect(createdUser.created).toBeTruthy()
  })

  it('when transaction throws an error, should expect an error', async () => {
    userRepositoryMock.findByUsernameOrEmail.mockResolvedValueOnce(null)
    userRepositoryMock.create.mockRejectedValueOnce(new Error('createUseError'))
    await expect(useCase.execute(userMock)).rejects.toThrow('createUseError')
  })

  it('when user already exists, should expect an error', async () => {
    userRepositoryMock.findByUsernameOrEmail.mockResolvedValueOnce(userMock)
    await expect(useCase.execute(userMock)).rejects.toThrow()
  })
})
