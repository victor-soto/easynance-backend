import { Body, Controller, Post } from '@nestjs/common'

import { CreateCategoryInput } from '@/core/category/usecases/types'
import { CreatedModel } from '@/infra/repository/types'

import { ICreateCategoryAdapter } from './adapter'

@Controller({ path: 'categories', version: '1' })
export class CategoryController {
  constructor(private readonly createCategory: ICreateCategoryAdapter) {}

  @Post()
  async create(@Body() input: CreateCategoryInput): Promise<CreatedModel> {
    return this.createCategory.execute(input)
  }
}
