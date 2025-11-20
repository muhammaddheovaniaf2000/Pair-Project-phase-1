'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserProfile extends Model {
    static associate(models) {
      UserProfile.belongsTo(models.User, { foreignKey: 'UserId' })
      UserProfile.hasMany(models.Post, { foreignKey: 'UserProfileId' })
    }
  }
  UserProfile.init({
    name: DataTypes.STRING,
    profilePict: DataTypes.STRING,
    UserId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'UserProfile',
  });
  return UserProfile;
};