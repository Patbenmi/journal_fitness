'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class exercise extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.exercise.belongsToMany(models.user, {through: 'userExercises'})
      models.exercise.hasMany(models.comment)
      models.exercise.belongsToMany(models.workout, {through: 'exerciseWorkouts'})
    }
  };
  exercise.init({
    exerciseName: DataTypes.STRING,
    exerciseMuscle: DataTypes.STRING,
    exerciseDescription: DataTypes.TEXT,
    apiId: DataTypes.INTEGER,
    exerciseLanguage: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'exercise',
  });
  return exercise;
};