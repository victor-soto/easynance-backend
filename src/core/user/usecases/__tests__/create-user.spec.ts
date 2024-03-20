import { Test } from '@nestjs/testing'
import { faker } from '@faker-js/faker'

import { ICreateUserAdapter } from '@/modules/user/adapter'
import { CreateUserUseCase } from '../create-user'
import { IUserRepository } from '../../repository'

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
    findOne: jest.fn(),
    create: jest.fn()
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

  fit('when user created successfully, should expect an user that has been created', async () => {
    userRepositoryMock.findOne.mockResolvedValueOnce(null)
    userRepositoryMock.create.mockResolvedValueOnce({ id: faker.number.int(10), created: true })
    const createdUser = await useCase.execute(userMock)
    expect(createdUser).toHaveProperty('id')
    expect(createdUser.created).toBeTruthy()
  })
})
