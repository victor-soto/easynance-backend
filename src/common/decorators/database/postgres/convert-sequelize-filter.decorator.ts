import { z } from 'zod'

import { PaginationSchema } from '@/utils/pagination'
import { SearchSchema } from '@/utils/search'
import { SortSchema } from '@/utils/sort'

const ListSchema = z.intersection(PaginationSchema, SortSchema.merge(SearchSchema))

export function ConvertSequelizeFilterToRepository() {
  return (_target: unknown, _propertyKey: string, descriptor: PropertyDescriptor) => {
    const originalMethod = descriptor.value
    descriptor.value = function (...args: z.infer<typeof ListSchema>[]) {
      const input = args[0]

      if (!input) {
        const result = originalMethod.apply(this, args)
        return result
      }

      args[0] = input

      const result = originalMethod.apply(this, args)
      return result
    }
  }
}
