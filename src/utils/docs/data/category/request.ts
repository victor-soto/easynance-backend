import { faker } from '@faker-js/faker'

export const CategoryRequest = {
  create: {
    name: faker.lorem.word(),
    type: faker.helpers.arrayElement(['Income', 'Expense']),
    description: faker.lorem.paragraph(1),
    icon: faker.image.url(),
    iconAltText: faker.lorem.slug()
  },
  update: {
    id: faker.number.int(10),
    type: faker.helpers.arrayElement(['Income', 'Expense']),
    name: faker.lorem.word(),
    description: faker.lorem.paragraph(1),
    icon: faker.image.url(),
    iconAltText: faker.lorem.slug()
  }
}
