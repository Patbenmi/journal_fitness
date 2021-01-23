'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('workouts', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      firstExercise: {
        type: Sequelize.STRING
      },
      secondExercise: {
        type: Sequelize.STRING
      },
      thridExercise: {
        type: Sequelize.STRING
      },
      fourthExercise: {
        type: Sequelize.STRING
      },
      fifthExercise: {
        type: Sequelize.STRING
      },
      name: {
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
    await queryInterface.dropTable('workouts');
  }
};