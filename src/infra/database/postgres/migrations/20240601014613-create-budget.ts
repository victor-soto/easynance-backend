'use strict'

import { DataTypes, QueryInterface } from 'sequelize'
import { Sequelize } from 'sequelize-typescript'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async up(queryInterface: QueryInterface, Sequelize: Sequelize) {
    const transaction = await queryInterface.sequelize.transaction()
    try {
      await queryInterface.createTable(
        'budgets',
        {
          id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
          },
          type: {
            type: DataTypes.STRING,
            allowNull: false
          },
          start_date: {
            type: DataTypes.DATE,
            allowNull: false
          },
          end_date: {
            type: DataTypes.DATE,
            allowNull: false
          },
          user_id: {
            type: DataTypes.INTEGER,
            references: { model: 'users', key: 'id' },
            allowNull: false
          },
          created_at: {
            allowNull: false,
            type: DataTypes.DATE
          },
          updated_at: {
            allowNull: false,
            type: DataTypes.DATE
          },
          deleted_at: {
            type: DataTypes.DATE,
            allowNull: true
          }
        },
        { transaction }
      )
      await transaction.commit()
    } catch (error) {
      await transaction.rollback()
      throw error
    }
  },

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async down(queryInterface: QueryInterface, Sequelize: Sequelize) {
    const transaction = await queryInterface.sequelize.transaction()
    try {
      await queryInterface.dropTable('budgets', { transaction })
      await transaction.commit()
    } catch (error) {
      await transaction.rollback()
      throw error
    }
  }
}
