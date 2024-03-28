import { z } from 'zod'

import { SearchInput } from './search'
import { SortInput } from './sort'

const maxLimit = (limit: number) => (limit > 100 ? 100 : limit)

export const PaginationSchema = z
  .object({
    page: z.number().or(z.string()).or(z.nan()).default(1),
    limit: z.number().or(z.string()).or(z.nan()).default(10)
  })
  .transform((pagination) => {
    let page = +pagination.page
    let limit = +pagination.limit

    if (isNaN(page)) page = 1
    if (isNaN(limit)) limit = 10
    return {
      page: page > 0 ? page : 1,
      limit: limit > 0 ? maxLimit(limit) : 10
    }
  })

export type PaginationInput<T> = z.infer<typeof PaginationSchema> & SortInput & SearchInput<Partial<T>>
export type PaginationOutput<T> = z.infer<typeof PaginationSchema> & { total: number; items: T[] }
