'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async up(queryInterface, _Sequelize) {
    return queryInterface.sequelize.transaction((transaction) => {
      return Promise.all([
        queryInterface.sequelize.query(
          `
          INSERT INTO "users" (id, username, "password", email, first_name, last_name, created_at, updated_at, active)
          OVERRIDING SYSTEM VALUE
          VALUES (1, 'admin', '$2b$10$gY0UYfveAlk21jhStxsjTuMKuGd3Mmc4Edzs2oAK9fQaiST/pAMIC', 'admin@example.com', 'John', 'Doe', '${new Date().toISOString()}', '${new Date().toISOString()}', true);
          `,
          transaction
        ),
        queryInterface.sequelize.query(
          `
          INSERT INTO "user_roles" (id, user_id, role_id, created_at, updated_at)
          OVERRIDING SYSTEM VALUE
          VALUES (1, 1, 1, '${new Date().toISOString()}', '${new Date().toISOString()}');
          `,
          transaction
        )
      ])
    })
  },

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async down(queryInterface, _Sequelize) {
    return queryInterface.sequelize.transaction((transaction) => {
      return Promise.all([
        queryInterface.sequelize.query(`DELETE FROM "users" WHERE id = 1`, transaction),
        queryInterface.sequelize.query(`DELETE FROM "user_roles" WHERE id = 1`, transaction)
      ])
    })
  }
}
