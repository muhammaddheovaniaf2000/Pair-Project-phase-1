'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Post extends Model {
    static associate(models) {
      Post.belongsTo(models.UserProfile, { foreignKey: 'UserProfileId' })
      Post.belongsToMany(models.Tag, { through: models.PostTag, foreignKey: 'PostId' })
    }

    // Req Aplikasi 3: Getter (Kita pakai buat preview caption, BUKAN time ago)
    get captionSnippet() {
      // Jika caption lebih dari 20 karakter, potong dan tambah '...'
      if (this.caption && this.caption.length > 20) {
          return this.caption.substring(0, 20) + '...';
      }
      return this.caption;
    }
  }
  
  Post.init({
    posting: DataTypes.STRING,
    caption: { 
      type: DataTypes.STRING, 
      validate: { notEmpty: { msg: "Caption tidak boleh kosong" } } 
    },
    like: { type: DataTypes.INTEGER, defaultValue: 0 },
    UserProfileId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Post',
  });
  return Post;
};