import { faker } from '@faker-js/faker'
import { Test } from '@nestjs/testing'
import { ZodIssue } from 'zod'

import { ICreateCategoryAdapter } from '@/modules/category/adapter'
import { expectZodError, mockedTransaction } from '@/utils/tests'

import { CategoryEntity } from '../../entity/category'
import { ICategoryRepository } from '../../repository'
import { CreateCategoryUseCase } from '../create-category'
import { CreateCategoryInput } from '../types'

describe('#CreateCategoryUseCase', () => {
  let useCase: ICreateCategoryAdapter
  const repositoryMock = {
    startTransaction: mockedTransaction,
    commit: jest.fn(),
    rollback: jest.fn(),
    create: jest.fn()
  }

  const entity: CreateCategoryInput = {
    name: faker.lorem.word(),
    description: faker.lorem.paragraph(1),
    icon: faker.internet.url(),
    iconAltText: faker.lorem.paragraph(1)
  }

  beforeEach(async () => {
    const app = await Test.createTestingModule({
      providers: [
        {
          provide: ICategoryRepository,
          useValue: repositoryMock
        },
        {
          provide: ICreateCategoryAdapter,
          useFactory: (repository: ICategoryRepository) => new CreateCategoryUseCase(repository),
          inject: [ICategoryRepository]
        }
      ]
    }).compile()
    useCase = app.get<ICreateCategoryAdapter>(ICreateCategoryAdapter)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('when category created successfully, should expect a category that has been created', async () => {
    repositoryMock.create.mockResolvedValue({ id: 1, created: true })
    const createdCategory = await useCase.execute(entity)
    expect(createdCategory).toEqual({ id: 1, created: true })
    expect(repositoryMock.create).toHaveBeenCalledWith({ ...entity, active: true }, expect.anything())
  })

  it('when no input is specified, should expect an error', async () => {
    await expectZodError(
      () => useCase.execute({}),
      (issues: ZodIssue[]) => {
        expect(issues).toEqual([
          { message: 'Required', path: CategoryEntity.nameOf('name') },
          { message: 'Required', path: CategoryEntity.nameOf('icon') }
        ])
      }
    )
  })

  it('when transaction throws an error, should expect an error', () => {
    repositoryMock.startTransaction.mockRejectedValueOnce(new Error('Name must be unique'))
    expect(useCase.execute(entity)).rejects.toThrow('Name must be unique')
  })
})
