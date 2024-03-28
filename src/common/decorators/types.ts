import { z } from 'zod'

import { PaginationSchema } from '@/utils/pagination'
import { SearchSchema } from '@/utils/search'
import { SortSchema } from '@/utils/sort'

export enum SearchTypeEnum {
  'like',
  'equal'
}

export type AllowedFilter<T> = {
  type: SearchTypeEnum
  name: keyof T
}

export const ListSchema = z.intersection(PaginationSchema, SortSchema.merge(SearchSchema))
