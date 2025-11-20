'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Posts', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      posting: { // <--- INI YANG PENTING (Harus sama dengan Model)
        type: Sequelize.STRING
      },
      caption: {
        type: Sequelize.STRING
      },
      like: {    // <--- INI JUGA PENTING
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      UserProfileId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'UserProfiles',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Posts');
  }
};