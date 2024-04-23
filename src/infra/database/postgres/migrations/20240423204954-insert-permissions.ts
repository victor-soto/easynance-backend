'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async up(queryInterface, _Sequelize) {
    return queryInterface.sequelize.transaction((transaction) => {
      return queryInterface.sequelize.query(
        `
        INSERT INTO "permissions" (id, "name", description, "path", "method", active, created_at, updated_at)
        OVERRIDING SYSTEM VALUE
        VALUES(5, 'Create category', 'Create categories.', '^/api/v1/categories$', 'POST', true, '${new Date().toISOString()}', '${new Date().toISOString()}');
        SELECT setval('permissions_id_seq', 5);
        INSERT INTO role_permissions (role_id, permission_id, created_at, updated_at) VALUES
        (1, 5, '${new Date().toISOString()}', '${new Date().toISOString()}'),
        (2, 5, '${new Date().toISOString()}', '${new Date().toISOString()}');
        `,
        transaction
      )
    })
  },

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async down(queryInterface, _Sequelize) {
    return queryInterface.sequelize.transaction((transaction) => {
      return Promise.all([
        queryInterface.sequelize.query(
          `
        DELETE FROM role_permissions WHERE permission_id IN (5);
        DELETE FROM "permissions" WHERE id IN (5);
        `,
          transaction
        ),
        queryInterface.sequelize.query('ALTER SEQUENCE permissions_id_seq RESTART WITH 5;', transaction)
      ])
    })
  }
}
