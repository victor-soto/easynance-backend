import { faker } from '@faker-js/faker'
import { Test } from '@nestjs/testing'
import { ZodIssue } from 'zod'

import { IListCategoryAdapter } from '@/modules/category/adapter'
import { expectZodError } from '@/utils/tests'

import { CategoryEntity } from '../../entity/category'
import { ICategoryRepository } from '../../repository'
import { ListCategoryUseCase } from '../list-category'
import { ListCategoryInput } from '../types'

describe('#ListCategoryUseCase', () => {
  let useCase: IListCategoryAdapter
  const repositoryMock = {
    paginate: jest.fn()
  }

  beforeEach(async () => {
    const app = await Test.createTestingModule({
      providers: [
        {
          provide: ICategoryRepository,
          useValue: repositoryMock
        },
        {
          provide: IListCategoryAdapter,
          useFactory: (repository: ICategoryRepository) => new ListCategoryUseCase(repository),
          inject: [ICategoryRepository]
        }
      ]
    }).compile()
    useCase = app.get<IListCategoryAdapter>(IListCategoryAdapter)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('when categories are found, should return a category list', async () => {
    const categories = [
      {
        id: 1,
        name: faker.lorem.word(),
        description: faker.lorem.paragraph(),
        active: true,
        icon: faker.image.url(),
        iconAltText: faker.lorem.slug()
      } as CategoryEntity
    ]
    repositoryMock.paginate.mockResolvedValue({ items: categories, page: 1, limit: 1, total: 1 })
    await expect(useCase.execute({ page: 1, limit: 10, sort: {}, search: null })).resolves.toEqual({
      items: categories,
      page: 1,
      limit: 1,
      total: 1
    })
  })

  it('when no input is specified, should expect an error', async () => {
    await expectZodError(
      () => useCase.execute({} as ListCategoryInput),
      (issues: ZodIssue[]) => {
        expect(issues).toEqual([
          { message: 'Required', path: 'sort' },
          { message: 'Required', path: 'search' }
        ])
      }
    )
  })

  it('when categories are not found, should return an empty list', () => {
    repositoryMock.paginate.mockResolvedValue({ items: [], page: 1, limit: 1, total: 0 })
    expect(useCase.execute({ page: 1, limit: 10, sort: {}, search: null })).resolves.toEqual({
      items: [],
      page: 1,
      limit: 1,
      total: 0
    })
  })
})
