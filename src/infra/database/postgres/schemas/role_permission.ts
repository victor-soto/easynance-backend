import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript'

import { PermissionSchema } from './permission'
import { RoleSchema } from './role'

@Table({ timestamps: true, tableName: 'role_permissions', underscored: true })
export class RolePermissionSchema extends Model {
  @Column({ primaryKey: true, autoIncrement: true, type: DataType.INTEGER })
  id: number

  @BelongsTo(() => RoleSchema, 'roleId')
  role: RoleSchema

  @ForeignKey(() => RoleSchema)
  roleId: number

  @BelongsTo(() => PermissionSchema, 'permissionId')
  permission: PermissionSchema

  @ForeignKey(() => PermissionSchema)
  permissionId: number
}
