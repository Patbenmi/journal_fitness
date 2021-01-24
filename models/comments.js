'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class comments extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // models.comments.belongsTo(models.exercise, {through: 'exerciseComment'})
      models.comments.belongsTo(models.exerciseComment, {foreignKey: 'commentId'})
      models.comments.belongsTo(models.users)
    }
  };
  comments.init({
    userId: DataTypes.INTEGER,
    exerciseId: DataTypes.INTEGER,
    comment: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'comments',
  });
  return comments;
};