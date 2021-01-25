'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('exercises', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      exerciseName: {
        type: Sequelize.STRING
      },
      exerciseMuscle: {
        type: Sequelize.STRING
      },
      exerciseDescription: {
        type: Sequelize.TEXT
      },
      apiId: {
        type: Sequelize.INTEGER
      },
      exerciseLanguage: {
        type: Sequelize.STRING
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
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('exercises');
  }
};