'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async up(queryInterface, _Sequelize) {
    return queryInterface.sequelize.transaction((transaction) => {
      return Promise.all([
        queryInterface.sequelize.query(
          `
        INSERT INTO "roles" (id, "name", description, active, created_at, updated_at)
        OVERRIDING SYSTEM VALUE
        VALUES(1, 'Admin', 'Grants full administrative privileges across the entire application.', true, '${new Date().toISOString()}', '${new Date().toISOString()}');
        INSERT INTO "roles" (id, "name", description, active, created_at, updated_at)
        OVERRIDING SYSTEM VALUE
        VALUES(2, 'User', 'Grants access to interact with the application''s features and functionalities.', true, '${new Date().toISOString()}', '${new Date().toISOString()}');
        `,
          transaction
        ),
        queryInterface.sequelize.query("SELECT setval('roles_id_seq', 2);", transaction)
      ])
    })
  },

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async down(queryInterface, _Sequelize) {
    return queryInterface.sequelize.transaction((transaction) => {
      return Promise.all([
        queryInterface.sequelize.query('DELETE FROM "roles" WHERE id IN (1, 2);', transaction),
        queryInterface.sequelize.query('ALTER SEQUENCE roles_id_seq RESTART WITH 1;', transaction)
      ])
    })
  }
}
