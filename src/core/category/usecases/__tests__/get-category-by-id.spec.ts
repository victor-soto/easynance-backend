import { faker } from '@faker-js/faker'
import { Test } from '@nestjs/testing'
import { ZodIssue } from 'zod'

import { ICategoryGetByIdAdapter as IGetCategoryByIdAdapter } from '@/modules/category/adapter'
import { ApiNotFoundException } from '@/utils/exception'
import { expectZodError } from '@/utils/tests'

import { CategoryEntity } from '../../entity/category'
import { ICategoryRepository } from '../../repository'
import { GetCategoryByIdUseCase } from '../category-get-by-id'

describe('#GetCategoryByIdUseCase', () => {
  let useCase: IGetCategoryByIdAdapter
  const repositoryMock = {
    findById: jest.fn()
  }

  beforeEach(async () => {
    const app = await Test.createTestingModule({
      providers: [
        {
          provide: ICategoryRepository,
          useValue: repositoryMock
        },
        {
          provide: IGetCategoryByIdAdapter,
          useFactory: (repository: ICategoryRepository) => new GetCategoryByIdUseCase(repository),
          inject: [ICategoryRepository]
        }
      ]
    }).compile()
    useCase = app.get<IGetCategoryByIdAdapter>(IGetCategoryByIdAdapter)
  })

  afterEach(() => jest.clearAllMocks())

  it('when no input specified, should expect an error', async () => {
    await expectZodError(
      () => useCase.execute({}),
      (issues: ZodIssue[]) => {
        expect(issues).toEqual([{ message: 'Required', path: CategoryEntity.nameOf('id') }])
      }
    )
  })

  it('when category not found, should expect an error', async () => {
    repositoryMock.findById.mockReturnValueOnce(null)
    await expect(useCase.execute({ id: 1 })).rejects.toThrow(ApiNotFoundException)
  })

  it('when category found, should expect a category that has been found', async () => {
    const categoryMock = {
      id: faker.number.int(10),
      name: faker.lorem.word(),
      description: faker.lorem.words(5),
      icon: faker.image.url(),
      iconAltText: faker.lorem.slug(),
      active: true
    } as CategoryEntity
    repositoryMock.findById.mockReturnValueOnce(categoryMock)
    await expect(useCase.execute({ id: categoryMock.id })).resolves.toEqual(categoryMock)
  })
})
