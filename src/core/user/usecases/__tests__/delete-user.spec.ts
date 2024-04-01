import { faker } from '@faker-js/faker'
import { Test } from '@nestjs/testing'
import { ZodError } from 'zod'

import { IDeleteUserAdapter } from '@/modules/user/adapter'
import { expectZodError } from '@/utils/tests'

import { UserEntity } from '../../entity/user'
import { IUserRepository } from '../../repository'
import { DeleteUserUseCase } from '../delete-user'

describe('#DeleteUserUseCase', () => {
  let useCase: IDeleteUserAdapter
  const repositoryMock = {
    findById: jest.fn(),
    updateOne: jest.fn()
  }

  beforeEach(async () => {
    const app = await Test.createTestingModule({
      providers: [
        {
          provide: IUserRepository,
          useValue: repositoryMock
        },
        {
          provide: IDeleteUserAdapter,
          useFactory: (userRepository: IUserRepository) => {
            return new DeleteUserUseCase(userRepository)
          },
          inject: [IUserRepository]
        }
      ]
    }).compile()
    useCase = app.get<IDeleteUserAdapter>(IDeleteUserAdapter)
  })

  it('when no input is specified, should expect an error', async () => {
    await expectZodError(
      () => useCase.execute({}),
      (issues: ZodError[]) => {
        expect(issues).toEqual([{ message: 'Required', path: UserEntity.nameOf('id') }])
      }
    )
  })

  it('when user not found, should return an error', async () => {
    repositoryMock.findById.mockResolvedValueOnce(null)
    await expect(useCase.execute({ id: faker.number.int(10) })).rejects.toThrow('User not found')
  })

  it('when user deleted successfully, should expect an user that has been deleted', async () => {
    const userMock = {
      id: faker.number.int(10),
      username: faker.internet.userName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName()
    } as UserEntity
    repositoryMock.findById.mockResolvedValueOnce(userMock)
    await expect(useCase.execute({ id: userMock.id })).resolves.toEqual({
      ...userMock,
      password: '**********',
      active: false
    })
  })
})
