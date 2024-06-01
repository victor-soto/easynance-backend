'use strict'

import { QueryInterface, Sequelize } from 'sequelize'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async up(queryInterface: QueryInterface, _Sequelize: Sequelize) {
    const transaction = await queryInterface.sequelize.transaction()
    try {
      await queryInterface.sequelize.query(
        `
        INSERT INTO "permissions" (id, "name", description, "path", "method", active, created_at, updated_at)
        OVERRIDING SYSTEM VALUE
        VALUES(10, 'Create budget', 'Create a new budget for a user.', '^/api/v1/budgets$', 'POST', true, '${new Date().toISOString()}', '${new Date().toISOString()}');
        SELECT setval('permissions_id_seq', 10);
        INSERT INTO role_permissions (role_id, permission_id, created_at, updated_at) VALUES
        (1, 10, '${new Date().toISOString()}', '${new Date().toISOString()}'),
        (2, 10, '${new Date().toISOString()}', '${new Date().toISOString()}');
        `,
        { transaction }
      )
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
      await queryInterface.sequelize.query(
        `
        DELETE FROM role_permissions WHERE permission_id IN (10);
        DELETE FROM "permissions" WHERE id IN (10);
        `,
        { transaction }
      )
      await queryInterface.sequelize.query('ALTER SEQUENCE permissions_id_seq RESTART WITH 10;', { transaction })
      await transaction.commit()
    } catch (error) {
      await transaction.rollback()
      throw error
    }
  }
}
