'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async up(queryInterface, _Sequelize) {
    return queryInterface.sequelize.query(
      `
        INSERT INTO "permissions" (id, "name", description, "path", "method", active, created_at, updated_at)
        OVERRIDING SYSTEM VALUE
        VALUES(7, 'Delete category', 'Delete categories.', '^/api/v1/categories/[0-9]+$', 'DELETE', true, '${new Date().toISOString()}', '${new Date().toISOString()}');
        SELECT setval('permissions_id_seq', 7);
        INSERT INTO role_permissions (role_id, permission_id, created_at, updated_at) VALUES
        (1, 7, '${new Date().toISOString()}', '${new Date().toISOString()}'),
        (2, 7, '${new Date().toISOString()}', '${new Date().toISOString()}');
        `
    )
  },

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async down(queryInterface, _Sequelize) {
    return queryInterface.sequelize.transaction((transaction) => {
      return Promise.all([
        queryInterface.sequelize.query(
          `
        DELETE FROM role_permissions WHERE permission_id IN (7);
        DELETE FROM "permissions" WHERE id IN (7);
        `,
          transaction
        ),
        queryInterface.sequelize.query('ALTER SEQUENCE permissions_id_seq RESTART WITH 7;', transaction)
      ])
    })
  }
}
