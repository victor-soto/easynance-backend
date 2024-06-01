import { faker } from '@faker-js/faker'
import { Test } from '@nestjs/testing'
import { ZodError } from 'zod'

import { CategoryEntity, CategoryType } from '@/core/category/entity/category'
import { ICategoryRepository } from '@/core/category/repository'
import { UpdatedModel } from '@/infra/repository'
import { IDeleteCategoryAdapter } from '@/modules/category/adapter'
import { expectZodError } from '@/utils/tests'

import { DeleteCategoryUseCase } from '../delete-category'

describe('#DeleteCategoryUseCase', () => {
  let useCase: IDeleteCategoryAdapter

  const categoryRepositoryMock = {
    findById: jest.fn(),
    updateOne: jest.fn()
  }

  beforeEach(async () => {
    const app = await Test.createTestingModule({
      providers: [
        {
          provide: ICategoryRepository,
          useValue: categoryRepositoryMock
        },
        {
          provide: IDeleteCategoryAdapter,
          useFactory: (repository: ICategoryRepository) => {
            return new DeleteCategoryUseCase(repository)
          },
          inject: [ICategoryRepository]
        }
      ]
    }).compile()
    useCase = app.get<IDeleteCategoryAdapter>(IDeleteCategoryAdapter)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('when category deleted successfully, should return a category that has been deleted', async () => {
    const category = {
      id: faker.number.int(10),
      name: faker.lorem.word(),
      icon: faker.image.url(),
      iconAltText: faker.lorem.slug(),
      active: true,
      type: CategoryType.Expense
    } as CategoryEntity
    categoryRepositoryMock.findById.mockResolvedValueOnce(category)
    categoryRepositoryMock.updateOne.mockResolvedValueOnce({
      matchedCount: 1,
      modifiedCount: 1,
      upsertedCount: 0
    } as UpdatedModel)
    await expect(useCase.execute({ id: 1 })).resolves.toEqual({ ...category, deletedAt: expect.any(Date) })
  })

  it('when category not found, should return an error', async () => {
    categoryRepositoryMock.findById.mockResolvedValueOnce(null)
    await expect(useCase.execute({ id: 1 })).rejects.toThrow('Category not found')
  })

  it('when no input specified, should expect an error', async () => {
    await expectZodError(
      () => useCase.execute({}),
      (issues: ZodError[]) => {
        expect(issues).toEqual([{ message: 'Required', path: CategoryEntity.nameOf('id') }])
      }
    )
  })
})
