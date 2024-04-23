import { Sequelize } from 'sequelize-typescript'

import { ILoggerAdapter } from '@/infra/logger/adapter'
import { ISecretAdapter } from '@/infra/secrets/adapter'

import { IDatabaseAdapter } from '../adapter'
import { CategorySchema } from './schemas/category'
import { PermissionSchema } from './schemas/permission'
import { RoleSchema } from './schemas/role'
import { RolePermissionSchema } from './schemas/role_permission'
import { UserSchema } from './schemas/user'
import { UserRoleSchema } from './schemas/user_role'

export class SequelizeService implements IDatabaseAdapter {
  private sequelize: Sequelize

  constructor(
    private readonly logger: ILoggerAdapter,
    private readonly secret: ISecretAdapter
  ) {}

  async connect(): Promise<Sequelize> {
    try {
      const dialect = 'postgres'
      const dbInstance = new Sequelize({
        host: this.secret.POSTGRES_HOST,
        port: this.secret.POSTGRES_PORT,
        database: this.secret.POSTGRES_DB,
        username: this.secret.POSTGRES_USER,
        password: this.secret.POSTGRES_PASSWORD,
        dialect: dialect,
        benchmark: true,
        timezone: this.secret.POSTGRES_TZ,
        logging: (msg, timing) => this.logger.log(`[sequelize], ${msg}, ${timing}ms`)
      })
      dbInstance.addModels([
        UserSchema,
        RoleSchema,
        PermissionSchema,
        RolePermissionSchema,
        UserRoleSchema,
        CategorySchema
      ])
      this.logger.log(`🎯 ${dialect} connected successfully!`)
      this.sequelize = dbInstance
      return this.sequelize
    } catch (error) {
      this.logger.fatal(error)
    }
  }

  getDatabase<T = Sequelize>(): T {
    return this.sequelize as T
  }
}
