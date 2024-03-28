import { ZodIssue } from 'zod'

import { SortHttpSchema } from '../sort'
import { expectZodError } from '../tests'

describe('Sort', () => {
  describe('#SortHttpSchema', () => {
    it('when sort schema is valid, should expect an object', () => {
      expect(SortHttpSchema.parse('createdAt:asc')).toEqual({
        createdAt: 1
      })

      expect(SortHttpSchema.parse('createdAt:desc')).toEqual({
        createdAt: -1
      })

      expect(SortHttpSchema.parse('createdAt:asc, updatedAt:desc')).toEqual({
        createdAt: 1,
        updatedAt: -1
      })
    })

    it('when sort schema is not valid, should return an error', () => {
      expectZodError(
        () => SortHttpSchema.parse(':createdAt=-1'),
        (issues: ZodIssue[]) => {
          expect(issues).toEqual([
            {
              message: 'invalidSortFormat',
              path: 'sort'
            },
            {
              message: 'invalidSortOrderMustBe: asc, desc',
              path: 'sort'
            }
          ])
        }
      )
    })

    it('when sort schema has not a valid format, should return an error', () => {
      expectZodError(
        () => SortHttpSchema.parse('createdAt:1'),
        (issues: ZodIssue[]) => {
          expect(issues).toEqual([
            {
              message: 'invalidSortOrderMustBe: asc, desc',
              path: 'sort'
            }
          ])
        }
      )
    })
  })
})
