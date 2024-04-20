import { faker } from '@faker-js/faker'

export const UserRequest = {
  create: {
    username: faker.internet.userName(),
    password: faker.internet.password(),
    email: faker.internet.email(),
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName()
  }
}
