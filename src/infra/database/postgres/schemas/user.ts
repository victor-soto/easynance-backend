import { BelongsToMany, Column, DataType, HasMany, Model, Table } from 'sequelize-typescript'

import { RoleSchema } from './role'
import { UserRoleSchema } from './user_role'

@Table({ timestamps: true, tableName: 'users', underscored: true, paranoid: true })
export class UserSchema extends Model {
  @Column({ primaryKey: true, autoIncrement: true, type: DataType.INTEGER })
  id: number

  @Column({ type: DataType.STRING })
  username: string

  @Column({ type: DataType.STRING })
  password: string

  @Column({ type: DataType.STRING })
  email: string

  @Column({ type: DataType.STRING })
  firstName: string

  @Column({ type: DataType.STRING })
  lastName: string

  @Column({ type: DataType.BOOLEAN, defaultValue: true })
  active: boolean

  @BelongsToMany(() => RoleSchema, () => UserRoleSchema)
  roles: RoleSchema[]

  @HasMany(() => UserRoleSchema)
  userRoles: UserRoleSchema[]
}
