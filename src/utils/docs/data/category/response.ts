import { faker } from '@faker-js/faker'

import {
  DeleteCategoryOutput,
  GetCategoryByIdOutput,
  ListCategoryOutput,
  UpdateCategoryOutput
} from '@/core/category/usecases/types'
import { CreatedModel } from '@/infra/repository'

export const CategoryResponse = {
  create: {
    id: faker.number.int(10),
    created: true
  } as CreatedModel,
  update: {
    id: faker.number.int(10),
    name: faker.lorem.word(),
    type: faker.helpers.arrayElement(['Income', 'Expense']),
    description: faker.lorem.paragraph(),
    icon: faker.image.url(),
    iconAltText: faker.lorem.slug(),
    active: true
  } as UpdateCategoryOutput,
  delete: {
    id: faker.number.int(10),
    name: faker.lorem.word(),
    type: faker.helpers.arrayElement(['Income', 'Expense']),
    description: faker.lorem.paragraph(),
    icon: faker.image.url(),
    iconAltText: faker.lorem.slug(),
    active: false
  } as DeleteCategoryOutput,
  list: {
    items: [
      {
        id: faker.number.int(10),
        type: faker.helpers.arrayElement(['Income', 'Expense']),
        name: faker.lorem.word(),
        description: faker.lorem.paragraph(),
        icon: faker.image.url(),
        iconAltText: faker.lorem.slug(),
        active: true
      } as UpdateCategoryOutput
    ],
    limit: 10,
    page: 1,
    total: 0
  } as ListCategoryOutput,
  getById: {
    id: faker.number.int(10),
    type: faker.helpers.arrayElement(['Income', 'Expense']),
    name: faker.lorem.word(),
    description: faker.lorem.paragraph(),
    icon: faker.image.url(),
    iconAltText: faker.lorem.slug(),
    active: true
  } as GetCategoryByIdOutput
}
