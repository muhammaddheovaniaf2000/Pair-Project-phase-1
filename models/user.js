'use strict';
const { Model } = require('sequelize');
const bcrypt = require('bcryptjs');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.hasOne(models.UserProfile, { foreignKey: 'UserId' })
    }
    
    static getAdmins() {
      return User.findAll({ where: { role: 'admin' } });
    }
  }
  User.init({
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: { msg: "Email required" },
        isEmail: { msg: "Invalid Email" }
      }
    },
    password: { type: DataTypes.STRING, validate: { len: [8, 100] } },
    role: DataTypes.STRING
  }, {
    hooks: {
      beforeCreate: (user) => {
        const salt = bcrypt.genSaltSync(10);
        user.password = bcrypt.hashSync(user.password, salt);
        if (!user.role) user.role = 'user';
      }
    },
    sequelize,
    modelName: 'User',
  });
  return User;
};