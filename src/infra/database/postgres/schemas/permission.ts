import { BelongsToMany, Column, DataType, Model, Table } from 'sequelize-typescript'

import { RoleSchema } from './role'
import { RolePermissionSchema } from './role_permission'

@Table({ timestamps: true, tableName: 'permissions', underscored: true })
export class PermissionSchema extends Model {
  @Column({ primaryKey: true, autoIncrement: true, type: DataType.INTEGER })
  id: number

  @Column({ type: DataType.STRING, allowNull: false })
  path: string

  @Column({ type: DataType.INTEGER, allowNull: false })
  method: string

  @Column({ type: DataType.BOOLEAN, defaultValue: true })
  active: boolean

  @BelongsToMany(() => RoleSchema, () => RolePermissionSchema)
  roles: RoleSchema[]
}
