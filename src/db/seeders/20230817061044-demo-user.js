'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
   await queryInterface.bulkInsert('Users', [{
    firstName: 'Test',
    lastName: 'ArtKK',
    email: 'example@example.com',
    createdAt: new Date(),
    updatedAt: new Date()
      }], {});
   
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', null, {});
  }
};
