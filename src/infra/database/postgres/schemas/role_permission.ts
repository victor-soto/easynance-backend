import { Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript'

import { PermissionSchema } from './permission'
import { RoleSchema } from './role'

@Table({ timestamps: true, tableName: 'role_permissions', underscored: true })
export class RolePermissionSchema extends Model {
  @Column({ primaryKey: true, autoIncrement: true, type: DataType.INTEGER })
  id: number

  @ForeignKey(() => RoleSchema)
  roleId: number

  @ForeignKey(() => PermissionSchema)
  permissionId: number
}
