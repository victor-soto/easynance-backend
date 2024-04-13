'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async up(queryInterface, _Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    return queryInterface.sequelize.transaction((transaction) => {
      return queryInterface.sequelize.query(
        `
        INSERT INTO "permissions" (id, "name", description, "path", "method", active, created_at, updated_at)
        OVERRIDING SYSTEM VALUE
        VALUES(1, 'Create user', 'Create new user for login.', '^/api/v1/users$', 'POST', true, '${new Date().toISOString()}', '${new Date().toISOString()}');
        INSERT INTO "permissions" (id, "name", description, "path", "method", active, created_at, updated_at)
        OVERRIDING SYSTEM VALUE
        VALUES(2, 'Update user', 'Update user information.', '^/api/v1/users$', 'PUT', true, '${new Date().toISOString()}', '${new Date().toISOString()}');
        INSERT INTO "permissions" (id, "name", description, "path", "method", active, created_at, updated_at)
        OVERRIDING SYSTEM VALUE
        VALUES(3, 'Get users', 'Get user list paginated.', '^/api/v1/users$', 'GET', true, '${new Date().toISOString()}', '${new Date().toISOString()}');
        INSERT INTO "permissions" (id, "name", description, "path", "method", active, created_at, updated_at)
        OVERRIDING SYSTEM VALUE
        VALUES(4, 'Delete user', 'Disable user.', '^/api/v1/users/[0-9]+$', 'DELETE', true, '${new Date().toISOString()}', '${new Date().toISOString()}');
        INSERT INTO "permissions" (id, "name", description, "path", "method", active, created_at, updated_at)
        OVERRIDING SYSTEM VALUE
        VALUES(5, 'Login user', 'Authenticate user.', '^/api/v1/login$', 'DELETE', true, '${new Date().toISOString()}', '${new Date().toISOString()}');
        INSERT INTO "permissions" (id, "name", description, "path", "method", active, created_at, updated_at)
        OVERRIDING SYSTEM VALUE
        VALUES(6, 'Logout user', NULL, '^/api/v1/logout$', 'DELETE', true, '${new Date().toISOString()}', '${new Date().toISOString()}');`,
        { transaction }
      )
    })
  },

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async down(queryInterface, _Sequelize) {
    await queryInterface.sequelize.query('DELETE FROM "permissions" WHERE id IN (1, 2, 3, 4, 5, 6);')
  }
}
