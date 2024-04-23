'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async up(queryInterface, _Sequelize) {
    return queryInterface.sequelize.transaction((transaction) => {
      return Promise.all([
        queryInterface.sequelize.query(
          `
        INSERT INTO "categories" (id, name, description, icon, icon_alt_text, active, created_at, updated_at)
        OVERRIDING SYSTEM VALUE
        VALUES
        (1, 'Savings', 'Savings category.', 'savings.svg', 'savings.svg', true, '${new Date().toISOString()}', '${new Date().toISOString()}'),
        (2, 'Taxes', 'Taxes category.', 'taxes.svg', 'taxes.svg', true, '${new Date().toISOString()}', '${new Date().toISOString()}'),
        (3, 'Food', 'Food category.', 'food.svg', 'food..svg', true, '${new Date().toISOString()}', '${new Date().toISOString()}'),
        (4, 'Personal Spending', 'Personal spending category.', 'personal-spending.svg', 'personal-spending.svg', true, '${new Date().toISOString()}', '${new Date().toISOString()}'),
        (5, 'Housing', 'Housing category.', 'housing.svg', 'housing.svg', true, '${new Date().toISOString()}', '${new Date().toISOString()}'),
        (6, 'Education', 'Education category.', 'education.svg', 'education.svg', true, '${new Date().toISOString()}', '${new Date().toISOString()}'),
        (7, 'Recreation & Entertainment', 'Recreation & Entertainment category.', 'recreation-entertainment.svg', 'recreation-entertainment.svg', true, '${new Date().toISOString()}', '${new Date().toISOString()}'),
        (8, 'Medical & Health', 'Medical & Health category.', 'medical-health.svg', 'medical-health.svg', true, '${new Date().toISOString()}', '${new Date().toISOString()}'),
        (9, 'Miscellaneous', 'Miscellaneous category.', 'miscellaneous.svg', 'miscellaneous.svg', true, '${new Date().toISOString()}', '${new Date().toISOString()}'),
        (10, 'Transportation', 'Transportation category.', 'transportation.svg', 'transportation.svg', true, '${new Date().toISOString()}', '${new Date().toISOString()}'),
        (11, 'Utilities', 'Utilities category.', 'utilities.svg', 'utilities.svg', true, '${new Date().toISOString()}', '${new Date().toISOString()}'),
        (12, 'Debt', 'Debt category.', 'debt.svg', 'debt.svg', true, '${new Date().toISOString()}', '${new Date().toISOString()}'),
        (13, 'Pets', 'Pets category.', 'pets.svg', 'pets.svg', true, '${new Date().toISOString()}', '${new Date().toISOString()}'),
        (14, 'Clothing', 'Clothing category.', 'clothing.svg', 'clothing.svg', true, '${new Date().toISOString()}', '${new Date().toISOString()}');
        `,
          transaction
        ),
        queryInterface.sequelize.query("SELECT setval('categories_id_seq', 14);", transaction)
      ])
    })
  },

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async down(queryInterface, _Sequelize) {
    return queryInterface.sequelize.transaction((transaction) => {
      return Promise.all([
        queryInterface.sequelize.query(
          `
        DELETE FROM "categories" WHERE id IN (1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14);
        `,
          transaction
        ),
        queryInterface.sequelize.query('ALTER SEQUENCE categories_id_seq RESTART WITH 1;', transaction)
      ])
    })
  }
}
