import { faker } from '@faker-js/faker'

import { CreatedModel } from '@/infra/repository'

export const CategoryResponse = {
  create: {
    id: faker.number.int(10),
    created: true
  } as CreatedModel
}
