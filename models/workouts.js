'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class workouts extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      // models.workouts.belongsTo(models.user, {through: 'userworkout'})
      // models.workouts.belongsToMany(models.exercise)
      // models.workouts.belongsToMany(models.workoutcomment, {through: 'userworkout'})
    }
  };
  workouts.init({
    firstExercise: DataTypes.STRING,
    secondExercise: DataTypes.STRING,
    thridExercise: DataTypes.STRING,
    fourthExercise: DataTypes.STRING,
    fifthExercise: DataTypes.STRING,
    name: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'workouts',
  });
  return workouts;
};