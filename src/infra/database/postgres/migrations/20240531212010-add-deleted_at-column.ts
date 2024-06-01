'use strict'

import { DataTypes, QueryInterface, Sequelize } from 'sequelize'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async up(queryInterface: QueryInterface, _Sequelize: Sequelize) {
    const transaction = await queryInterface.sequelize.transaction()
    try {
      await Promise.all([
        queryInterface.addColumn(
          'categories',
          'deleted_at',
          {
            type: DataTypes.DATE,
            allowNull: true
          },
          { transaction }
        ),
        queryInterface.addColumn(
          'permissions',
          'deleted_at',
          {
            type: DataTypes.DATE,
            allowNull: true
          },
          { transaction }
        ),
        queryInterface.addColumn(
          'roles',
          'deleted_at',
          {
            type: DataTypes.DATE,
            allowNull: true
          },
          { transaction }
        ),
        queryInterface.addColumn(
          'users',
          'deleted_at',
          {
            type: DataTypes.DATE,
            allowNull: true
          },
          { transaction }
        )
      ])
      await transaction.commit()
    } catch (error) {
      await transaction.rollback()
      throw error
    }
  },

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async down(queryInterface: QueryInterface, _Sequelize: Sequelize) {
    const transaction = await queryInterface.sequelize.transaction()
    try {
      await Promise.all([
        queryInterface.removeColumn('categories', 'deleted_at', { transaction }),
        queryInterface.removeColumn('permissions', 'deleted_at', { transaction }),
        queryInterface.removeColumn('roles', 'deleted_at', { transaction }),
        queryInterface.removeColumn('users', 'deleted_at', { transaction })
      ])
      await transaction.commit()
    } catch (error) {
      await transaction.rollback()
      throw error
    }
  }
}
