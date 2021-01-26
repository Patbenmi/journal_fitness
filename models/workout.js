'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class workout extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      models.workout.hasMany(models.workoutcomment)
      models.workout.belongsTo(models.user)
      models.workout.belongsToMany(models.exercise, {through: 'exerciseWorkouts'})
    }
  };
  workout.init({
    userId: DataTypes.INTEGER,
    name: DataTypes.STRING,
    description: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'workout',
  });
  return workout;
};