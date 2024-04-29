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
        VALUES(9, 'Get category', 'Get active category by id.', '^/api/v1/categories/[0-9]+$', 'GET', true, '${new Date().toISOString()}', '${new Date().toISOString()}');
        SELECT setval('permissions_id_seq', 9);
        INSERT INTO role_permissions (role_id, permission_id, created_at, updated_at) VALUES
        (1, 9, '${new Date().toISOString()}', '${new Date().toISOString()}'),
        (2, 9, '${new Date().toISOString()}', '${new Date().toISOString()}');
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
        DELETE FROM role_permissions WHERE permission_id IN (9);
        DELETE FROM "permissions" WHERE id IN (9);
        `,
        { transaction }
      )
      await queryInterface.sequelize.query('ALTER SEQUENCE permissions_id_seq RESTART WITH 9;', { transaction })
      await transaction.commit()
    } catch (error) {
      await transaction.rollback()
      throw error
    }
  }
}
