import { faker } from '@faker-js/faker'
import { ZodIssue } from 'zod'

import { SearchHttpSchema } from '../search'
import { expectZodError } from '../tests'

describe('Search', () => {
  describe('#SearchHttpSchema', () => {
    it('when search schema is valid, should expect an object', () => {
      const createdAt = faker.date.past().toISOString()
      const firstName = faker.person.firstName()
      const schema = SearchHttpSchema.parse(`createdAt:${createdAt},firstName:${firstName}`)
      expect(schema['createdAt']).toEqual(createdAt)
      expect(schema['firstName']).toEqual(firstName)
    })

    it('when search schema is not valid, should expect an error', () => {
      expectZodError(
        () => SearchHttpSchema.parse(':userId=1'),
        (issues: ZodIssue[]) => {
          expect(issues).toEqual([
            {
              message: 'invalidSearchFormat',
              path: 'search'
            }
          ])
        }
      )
    })

    it('when search schema has not a valid format, should return an schema', () => {
      expectZodError(
        () => SearchHttpSchema.parse('name:'),
        (issues: ZodIssue[]) =>
          expect(issues).toEqual([
            {
              message: 'searchMustBe: value',
              path: 'search'
            }
          ])
      )
    })
  })
})
