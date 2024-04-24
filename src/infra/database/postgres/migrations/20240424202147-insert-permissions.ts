'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async up(queryInterface, _Sequelize) {
    return queryInterface.sequelize.query(
      `
        INSERT INTO "permissions" (id, "name", description, "path", "method", active, created_at, updated_at)
        OVERRIDING SYSTEM VALUE
        VALUES(6, 'Create category', 'Create categories.', '^/api/v1/categories$', 'PUT', true, '${new Date().toISOString()}', '${new Date().toISOString()}');
        SELECT setval('permissions_id_seq', 6);
        INSERT INTO role_permissions (role_id, permission_id, created_at, updated_at) VALUES
        (1, 6, '${new Date().toISOString()}', '${new Date().toISOString()}'),
        (2, 6, '${new Date().toISOString()}', '${new Date().toISOString()}');
        `
    )
  },

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async down(queryInterface, _Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    return queryInterface.sequelize.transaction((transaction) => {
      return Promise.all([
        queryInterface.sequelize.query(
          `
        DELETE FROM role_permissions WHERE permission_id IN (6);
        DELETE FROM "permissions" WHERE id IN (6);
        `,
          transaction
        ),
        queryInterface.sequelize.query('ALTER SEQUENCE permissions_id_seq RESTART WITH 6;', transaction)
      ])
    })
  }
}
