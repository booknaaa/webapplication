'use strict';
const {Model} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class instruments extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  instruments.init({
    //func: DataTypes.ARRAY(DataTypes.STRING),
    func: DataTypes.STRING,
    funcname: DataTypes.STRING,
    value: DataTypes.STRING,
    postId: DataTypes.INTEGER,
    portId: DataTypes.STRING,
    baudrateId: DataTypes.INTEGER,
    count: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'instruments',
  });
  instruments.associate = (models) => {
    instruments.belongsTo(models.Post); // ความสัมพันธ์ระหว่าง instruments และ User
    instruments.hasMany(models.value); // ความสัมพันธ์ระหว่าง User และ Post
  };
  return instruments;
};