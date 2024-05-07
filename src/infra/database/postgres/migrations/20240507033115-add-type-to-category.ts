'use strict'

import { DataTypes, QueryInterface, Sequelize } from 'sequelize'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async up(queryInterface: QueryInterface, _Sequelize: Sequelize) {
    const transaction = await queryInterface.sequelize.transaction()
    try {
      await queryInterface.addColumn(
        'categories',
        'type',
        {
          type: DataTypes.STRING
        },
        { transaction }
      )
      await queryInterface.sequelize.query("UPDATE categories SET type = 'Expense';", { transaction })
      await queryInterface.changeColumn(
        'categories',
        'type',
        {
          type: DataTypes.STRING,
          allowNull: false
        },
        { transaction }
      )
      transaction.commit()
    } catch (error) {
      transaction.rollback()
    }
  },

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async down(queryInterface: QueryInterface, _Sequelize: Sequelize) {
    const transaction = await queryInterface.sequelize.transaction()
    try {
      await queryInterface.removeColumn('categories', 'type', { transaction })
      transaction.commit()
    } catch (error) {
      transaction.rollback()
    }
  }
}
