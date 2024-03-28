import { z } from 'zod'

export type SearchInput<T> = { search?: T }

export const SearchHttpSchema = z
  .string()
  .optional()
  .refine(
    (search) => {
      if (!search) return true
      return [!search.startsWith(':'), !(search.indexOf(':') < 0)].every(Boolean)
    },
    { message: 'invalidSearchFormat', path: ['search'] }
  )
  .refine(
    (search) => {
      if (!search) return true
      return String(search)
        .split(',')
        .every((s) => {
          const [value] = s.split(':').reverse()

          if (!value) return false
          return true
        })
    },
    { message: 'searchMustBe: value', path: ['search'] }
  )
  .transform((searchString) => {
    if (!searchString) return null
    const search = {}

    String(searchString)
      .split(',')
      .forEach((s) => {
        const propertyIndex = s.indexOf(':')
        const value = s.slice(propertyIndex + 1, s.length)
        const [field] = s.split(':')
        search[`${field}`] = value.trim()
      })

    return search
  })

export const SearchSchema = z.object({ search: z.record(z.string().trim(), z.number().or(z.string())).nullable() })
