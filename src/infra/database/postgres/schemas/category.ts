import { Column, DataType, Model, Table } from 'sequelize-typescript'

import { CategoryType } from '@/core/category/entity/category'

@Table({ timestamps: true, tableName: 'categories', underscored: true })
export class CategorySchema extends Model {
  @Column({ primaryKey: true, autoIncrement: true, type: DataType.INTEGER })
  id: number

  @Column({ type: DataType.ENUM, values: Object.values(CategoryType) })
  type: CategoryType

  @Column({ type: DataType.STRING, allowNull: false, unique: true })
  name: string

  @Column(DataType.STRING)
  description?: string

  @Column(DataType.STRING)
  icon: string

  @Column(DataType.STRING)
  iconAltText?: string

  @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: true })
  active?: boolean
}
