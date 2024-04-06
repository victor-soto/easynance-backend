import { z } from 'zod'

import { ApiBadRequestException } from '@/utils/exception'

import { ListSchema } from '../../types'

type AllowedSort<T> = keyof T

export function ValidateDatabaseSortAllowed<T>(...allowedSortList: AllowedSort<T>[]) {
  return (_target: unknown, _propertyKey: string, descriptor: PropertyDescriptor) => {
    const originalMethod = descriptor.value
    descriptor.value = function (...args: z.infer<typeof ListSchema>[]) {
      const input = args[0]

      const sort = {}

      const sortList = (allowedSortList || []) as unknown as string[]

      Object.keys(input.sort || {}).forEach((key) => {
        const allowed = sortList.includes(key)
        if (!allowed) throw new ApiBadRequestException(`allowed sorts are: ${sortList.join(', ')}`)
      })

      for (const allowedFilter of sortList) {
        if (!input.sort) continue
        const filter = input.sort[`${allowedFilter}`]
        if (filter) {
          sort[`${allowedFilter}`] = filter
        }
      }

      args[0].sort = sort
      const result = originalMethod.apply(this, args)
      return result
    }
  }
}
