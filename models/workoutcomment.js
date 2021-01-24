'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class workoutComment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.workoutcomment.belongsTo(models.workouts, {through: 'userworkout'})
      models.workoutcomment.belongsTo(models.user, {through: 'userworkout'})
    }
  };
  workoutComment.init({
    userId: DataTypes.INTEGER,
    workoutId: DataTypes.INTEGER,
    comment: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'workoutComment',
  });
  return workoutComment;
};