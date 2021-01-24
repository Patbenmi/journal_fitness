'use strict';
const {
  Model
} = require('sequelize');
const exercise = require('./exercise');
module.exports = (sequelize, DataTypes) => {
  class userExercise extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.userExercise.belongsTo(exercise)
      models.userExercise.belongsTo(users)
    }
  };
  userExercise.init({
    userId: DataTypes.INTEGER,
    exerciseId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'userExercise',
  });
  return userExercise;
};