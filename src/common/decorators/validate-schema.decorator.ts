import { Schema } from 'zod'

export function ValidateSchema<T>(schema: Schema) {
  return (_target: T, _propertyKey: string, descriptor: PropertyDescriptor) => {
    const originalMethod = descriptor.value
    descriptor.value = function (...args: any[]) {
      const model = schema.parse(args[0])
      args[0] = model
      const result = originalMethod.apply(this, args)
      return result
    }
  }
}
