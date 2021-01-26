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
        allowNull: false,
        type: Sequelize.STRING
      },
      exerciseMuscle: {
        allowNull: true,
        type: Sequelize.STRING
      },
      exerciseDescription: {
        allowNull: true,
        type: Sequelize.TEXT
      },
      apiId: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      exerciseLanguage: {
        allowNull: false,
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