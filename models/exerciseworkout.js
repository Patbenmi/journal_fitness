'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class exerciseWorkout extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      // models.exerciseworkout.belongsTo(model.exercise)
      // models.exerciseworkout.belongsTo(model.workouts)
    }
  };
  exerciseWorkout.init({
    exerciseId: DataTypes.INTEGER,
    workoutId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'exerciseWorkout',
  });
  return exerciseWorkout;
};