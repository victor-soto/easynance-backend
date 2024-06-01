import { Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript'

import { BudgetType } from '@/core/budget/entity/budget'

import { UserSchema } from './user'

@Table({ timestamps: true, tableName: 'budgets', underscored: true, paranoid: true })
export class BudgetSchema extends Model {
  @Column({ primaryKey: true, autoIncrement: true, type: DataType.INTEGER })
  id: number

  @Column({ type: DataType.ENUM, values: Object.values(BudgetType) })
  type: BudgetType

  @Column({ type: DataType.DATE, allowNull: false })
  startDate: Date

  @Column({ type: DataType.DATE, allowNull: false })
  endDate: Date

  @Column({ type: DataType.INTEGER, allowNull: false })
  @ForeignKey(() => UserSchema)
  userId: number
}
