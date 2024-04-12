import { BelongsToMany, Column, DataType, Model, Table } from 'sequelize-typescript'

import { PermissionSchema } from './permission'
import { RolePermissionSchema } from './role_permission'
import { UserSchema } from './user'
import { UserRoleSchema } from './user_role'

@Table({ timestamps: true, tableName: 'roles', underscored: true })
export class RoleSchema extends Model {
  @Column({ primaryKey: true, autoIncrement: true, type: DataType.INTEGER })
  id: number

  @Column({ type: DataType.STRING, allowNull: false, unique: true })
  name: string

  @Column({ type: DataType.STRING, allowNull: true })
  description?: string

  @Column({ type: DataType.BOOLEAN, defaultValue: true })
  active: boolean

  @BelongsToMany(() => PermissionSchema, () => RolePermissionSchema)
  permissions: PermissionSchema[]

  @BelongsToMany(() => UserSchema, () => UserRoleSchema)
  users: UserSchema[]
}
