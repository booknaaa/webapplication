'use strict';
const {Model} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class value extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  value.init({
    datavalue: DataTypes.STRING,
    instrumentId: DataTypes.INTEGER,
    postId: DataTypes.INTEGER,
    countId: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'value',
  });
  value.associate = (models) => {
    value.belongsTo(models.instruments); // ความสัมพันธ์ระหว่าง value และ User
  };
  return value;
};