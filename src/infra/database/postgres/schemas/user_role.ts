import { Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript'

import { RoleSchema } from './role'
import { UserSchema } from './user'

@Table({ timestamps: true, tableName: 'user_roles', underscored: true })
export class UserRoleSchema extends Model {
  @Column({ primaryKey: true, autoIncrement: true, type: DataType.INTEGER })
  id: number

  @Column({ type: DataType.INTEGER, allowNull: false })
  @ForeignKey(() => UserSchema)
  userId: number

  @Column({ type: DataType.INTEGER, allowNull: false })
  @ForeignKey(() => RoleSchema)
  roleId: number
}
