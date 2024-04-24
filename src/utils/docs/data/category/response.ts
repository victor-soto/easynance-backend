import { faker } from '@faker-js/faker'

import { UpdateCategoryOutput } from '@/core/category/usecases/types'
import { CreatedModel } from '@/infra/repository'

export const CategoryResponse = {
  create: {
    id: faker.number.int(10),
    created: true
  } as CreatedModel,
  update: {
    id: faker.number.int(10),
    name: faker.lorem.word(),
    description: faker.lorem.paragraph(),
    icon: faker.image.url(),
    iconAltText: faker.lorem.slug(),
    active: true
  } as UpdateCategoryOutput
}
