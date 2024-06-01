import { faker } from '@faker-js/faker'
import { Test } from '@nestjs/testing'
import { ZodIssue } from 'zod'

import { IUpdateCategoryAdapter } from '@/modules/category/adapter'
import { expectZodError } from '@/utils/tests'

import { CategoryEntity, CategoryType } from '../../entity/category'
import { ICategoryRepository } from '../../repository'
import { UpdateCategoryInput } from '../types'
import { UpdateCategoryUseCase } from '../update-category'

describe('#UpdateCategoryUseCase', () => {
  let useCase: IUpdateCategoryAdapter
  const categoryRepositoryMock = {
    existsOnUpdate: jest.fn(),
    findById: jest.fn(),
    updateOne: jest.fn()
  }
  const input: UpdateCategoryInput = {
    id: 1,
    name: 'Category',
    description: 'Category description',
    icon: 'icon.svg',
    iconAltText: 'icon alt text'
  }

  beforeEach(async () => {
    const app = await Test.createTestingModule({
      providers: [
        {
          provide: ICategoryRepository,
          useValue: categoryRepositoryMock
        },
        {
          provide: IUpdateCategoryAdapter,
          useFactory: (categoryRepository: ICategoryRepository) => new UpdateCategoryUseCase(categoryRepository),
          inject: [ICategoryRepository]
        }
      ]
    }).compile()
    useCase = app.get<IUpdateCategoryAdapter>(IUpdateCategoryAdapter)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('when category updated successfully, should expect a category updated', async () => {
    const existingCategory = {
      id: 1,
      name: faker.lorem.word(),
      icon: faker.image.url(),
      type: CategoryType.Expense,
      active: true
    }
    categoryRepositoryMock.findById.mockReturnValueOnce(existingCategory)
    categoryRepositoryMock.existsOnUpdate.mockReturnValueOnce(false)
    categoryRepositoryMock.updateOne.mockReturnValueOnce({ matchedCount: 1, modifiedCount: 1, upsertedCount: 0 })
    categoryRepositoryMock.findById.mockReturnValueOnce({ ...existingCategory, ...input })
    await expect(useCase.execute(input)).resolves.toEqual({ ...existingCategory, ...input })
    expect(categoryRepositoryMock.existsOnUpdate).toHaveBeenCalledWith({ name: input.name }, { id: input.id })
  })

  it("when category's name is taken, should expect an error", async () => {
    categoryRepositoryMock.findById.mockReturnValueOnce({
      name: faker.lorem.word(),
      icon: faker.image.url(),
      active: true
    })
    categoryRepositoryMock.existsOnUpdate.mockReturnValueOnce(true)
    await expect(useCase.execute(input)).rejects.toThrow("Category's name exists")
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

  it('when category not found, should expect an error', () => {
    categoryRepositoryMock.findById.mockReturnValueOnce(null)
    return expect(useCase.execute(input)).rejects.toThrow('Category not found')
  })
})
