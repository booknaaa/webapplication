'use strict';
const {Model} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class post extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  post.init({
    title: DataTypes.STRING,
    content: DataTypes.STRING,
    userId: DataTypes.INTEGER,
    port: DataTypes.STRING,
    baudrate: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Post',
  });
  post.associate = (models) => {
    post.belongsTo(models.User); // ความสัมพันธ์ระหว่าง post และ User
    post.hasMany(models.instruments); // ความสัมพันธ์ระหว่าง User และ post
  };
  return post;
};