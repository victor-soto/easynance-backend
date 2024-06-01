import { faker } from '@faker-js/faker'
import { Test } from '@nestjs/testing'
import { ZodIssue } from 'zod'

import { ICreateBudgetAdapter } from '@/modules/budget/adapter'
import { expectZodError, mockedTransaction } from '@/utils/tests'

import { BudgetEntity, BudgetType } from '../../entity/budget'
import { IBudgetRepository } from '../../repository'
import { CreateBudgetUserCase } from '../create-budget'

describe('CreateBudgetUserCase', () => {
  let useCase: ICreateBudgetAdapter
  const budgetRepositoryMock = {
    startTransaction: mockedTransaction,
    create: jest.fn()
  }
  const currentDate = new Date()
  const input = {
    type: BudgetType.Monthly,
    month: currentDate.getMonth(),
    year: currentDate.getFullYear(),
    userId: 1
  }

  beforeEach(async () => {
    const app = await Test.createTestingModule({
      providers: [
        { provide: IBudgetRepository, useValue: budgetRepositoryMock },
        {
          provide: ICreateBudgetAdapter,
          useFactory: (repository: IBudgetRepository) => new CreateBudgetUserCase(repository),
          inject: [IBudgetRepository]
        }
      ]
    }).compile()
    useCase = app.get<ICreateBudgetAdapter>(ICreateBudgetAdapter)
  })

  afterEach(() => jest.clearAllMocks())

  it('when input is invalid, should throw error', async () => {
    await expectZodError(
      () => useCase.execute({}),
      (issues: ZodIssue[]) => {
        expect(issues).toEqual([
          { message: 'Required', path: BudgetEntity.nameOf('type') },
          { message: 'Required', path: BudgetEntity.nameOf('userId') },
          { message: 'Required', path: 'month' },
          { message: 'Required', path: 'year' }
        ])
      }
    )
    await expectZodError(
      () => useCase.execute({ ...input, month: -1, year: new Date().getFullYear() - 2 }),
      (issues: ZodIssue[]) => {
        expect(issues).toEqual([
          { message: 'Number must be greater than or equal to 1', path: 'month' },
          { message: `Number must be greater than or equal to ${new Date().getFullYear() - 1}`, path: 'year' }
        ])
      }
    )
  })

  it('when input is valid, should return created model', async () => {
    budgetRepositoryMock.create.mockResolvedValueOnce({
      id: faker.number.int(10),
      created: true
    })
    await expect(useCase.execute(input)).resolves.toEqual({
      id: expect.any(Number),
      created: true
    })
    expect(budgetRepositoryMock.create).toHaveBeenCalledWith(
      { type: input.type, userId: input.userId, startDate: expect.any(Date), endDate: expect.any(Date) },
      { transaction: expect.anything() }
    )
  })

  it('when transaction fails, should execute rollback transaction', async () => {
    budgetRepositoryMock.create.mockRejectedValueOnce(new Error('Error creating budget'))
    await expect(useCase.execute(input)).rejects.toThrow('Error creating budget')
  })
})
