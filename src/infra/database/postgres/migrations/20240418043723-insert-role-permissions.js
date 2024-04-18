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
        `INSERT INTO role_permissions (role_id, permission_id, created_at, updated_at) VALUES
        (1, 1, '${new Date().toISOString()}', '${new Date().toISOString()}'),
        (1, 2, '${new Date().toISOString()}', '${new Date().toISOString()}'),
        (1, 3, '${new Date().toISOString()}', '${new Date().toISOString()}'),
        (1, 4, '${new Date().toISOString()}', '${new Date().toISOString()}');
        `,
        transaction
      )
    })
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
      return queryInterface.sequelize.query(`DELETE FROM role_permissions`, transaction)
    })
  }
}
