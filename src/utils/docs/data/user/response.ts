import { faker } from '@faker-js/faker'

import { CreatedModel } from '@/infra/repository/types'

export const UserResponse = {
  create: {
    id: faker.number.int(10),
    created: true
  } as CreatedModel
}
