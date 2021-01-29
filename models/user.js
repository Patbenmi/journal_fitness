'use strict';
const bcrypt = require('bcrypt')

const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class user extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      models.user.hasMany(models.workoutcomment)
      models.user.hasMany(models.workout)
      models.user.hasMany(models.comment)
      models.user.belongsToMany(models.exercise, {through: 'userExercises'})
    }
  };
  user.init({
    name_first: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: {
          arg: [2, 25],
          msg: 'Name must be between 2 and 25 characters long.'
        }
      }
    },
    name_last: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: {
          arg: [2, 25],
          msg: 'Name must be between 2 and 25 characters long.'
        }
      }
    },
    gender: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: {
          arg: [2, 25],
          msg: 'Name must be between 2 and 25 characters long.'
        }
      }
    },
    language: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: {
          arg: [2, 25],
          msg: 'Name must be between 2 and 25 characters long.'
        }
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail:{
          args: true,
          msg: 'Please enter a valid email address.'
        }
      }
    },
    password:{
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: {
          args: [8, 99], 
          msg: 'Password must be between 8 and 99 characters long.'
        }
      }
    }
  }, {
    sequelize,
    modelName: 'user',
  });

  user.addHook('beforeCreate', (pendingUser, options)=>{
    let hashedPassword = bcrypt.hashSync(pendingUser.password, 10)
    pendingUser.password = hashedPassword
  })

  user.prototype.validPassword = async function(passwordInput) {
    let match = await bcrypt.compare(passwordInput, this.password)
    return match
  }
  return user;
};