'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class exerciseComments extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.exercisecomment.hasMany(models.comments)
      models.exercisecomment.belongsTo(models.user)
      models.exercisecomment.belongsTo(models.exercise)
    }
  };
  exerciseComments.init({
    userId: DataTypes.INTEGER,
    exerciseId: DataTypes.INTEGER,
    commentId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'exerciseComments',
  });
  return exerciseComments;
};