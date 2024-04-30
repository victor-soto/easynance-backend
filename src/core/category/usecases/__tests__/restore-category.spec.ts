import { faker } from '@faker-js/faker'
import { Test } from '@nestjs/testing'
import { ZodIssue } from 'zod'

import { UpdatedModel } from '@/infra/repository'
import { IRestoreCategoryAdapter } from '@/modules/category/adapter'
import { ApiNotFoundException } from '@/utils/exception'
import { expectZodError } from '@/utils/tests'

import { CategoryEntity } from '../../entity/category'
import { ICategoryRepository } from '../../repository'
import { RestoreCategoryUseCase } from '../restore-category'

describe('#RestoreCategoryUseCase', () => {
  let useCase: IRestoreCategoryAdapter
  const repositoryMock = {
    findById: jest.fn(),
    findOne: jest.fn(),
    updateOne: jest.fn()
  }

  beforeEach(async () => {
    const app = await Test.createTestingModule({
      providers: [
        {
          provide: ICategoryRepository,
          useValue: repositoryMock
        },
        {
          provide: IRestoreCategoryAdapter,
          useFactory: (repository: ICategoryRepository) => new RestoreCategoryUseCase(repository),
          inject: [ICategoryRepository]
        }
      ]
    }).compile()
    useCase = app.get<IRestoreCategoryAdapter>(IRestoreCategoryAdapter)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('when no input specified, should expect an error', async () => {
    await expectZodError(
      () => useCase.execute({}),
      (issues: ZodIssue[]) => {
        expect(issues).toEqual([{ message: 'Required', path: CategoryEntity.nameOf('id') }])
      }
    )
  })

  it('when category not found, should expect an error', async () => {
    repositoryMock.findOne.mockResolvedValueOnce(null)
    await expect(useCase.execute({ id: 1 })).rejects.toThrow(ApiNotFoundException)
  })

  it('when category is found, should return restored category', () => {
    const category = {
      id: faker.number.int(10),
      name: faker.lorem.word(),
      description: faker.lorem.paragraph(),
      active: false,
      icon: faker.image.url(),
      iconAltText: faker.lorem.slug()
    } as CategoryEntity
    repositoryMock.findOne.mockResolvedValueOnce(category)
    repositoryMock.updateOne.mockResolvedValueOnce({
      matchedCount: 1,
      modifiedCount: 1,
      upsertedCount: 0
    } as UpdatedModel)
    repositoryMock.findById.mockResolvedValueOnce({ ...category, active: true })
    expect(useCase.execute({ id: 1 })).resolves.toEqual({ ...category, active: true })
  })
})
