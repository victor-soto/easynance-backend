import { faker } from '@faker-js/faker'

import { Role } from '@/core/role/entity/role'
import { UserEntity } from '@/core/user/entity/user'
import { DeleteUserOutput, ListUserOutput, UpdateUserOutput } from '@/core/user/usecases/types'
import { CreatedModel } from '@/infra/repository/types'

const entity = {
  username: faker.internet.userName(),
  password: faker.internet.password(),
  email: faker.internet.email(),
  firstName: faker.person.firstName(),
  lastName: faker.person.lastName(),
  active: true,
  roles: [
    {
      id: faker.number.int(10)
    }
  ] as Role
} as UserEntity

const updatedEntity = {
  ...entity,
  createdAt: faker.date.anytime(),
  updatedAt: faker.date.anytime()
}

export const UserResponse = {
  create: {
    id: faker.number.int(10),
    created: true
  } as CreatedModel,
  update: updatedEntity as UpdateUserOutput,
  list: { items: [updatedEntity], limit: 10, page: 1, total: 10 } as ListUserOutput,
  delete: { ...updatedEntity, active: false } as DeleteUserOutput
}
