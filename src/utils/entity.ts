import { ZodSchema, ZodType } from 'zod'

export class IEntity {
  id: number
  createdAt: Date
  updatedAt: Date
}

export const BaseEntity = <T>(schema: ZodSchema) => {
  abstract class Entity implements IEntity {
    readonly id: number

    readonly createdAt: Date

    readonly updatedAt: Date

    static nameOf = (name: keyof T) => name

    validate<T>(entity: T): ZodType {
      return schema.parse(entity)
    }
  }

  return Entity
}
