'use strict';
const { Model} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class user extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  user.init({
    first_name:  {
       type: DataTypes.STRING, 
       allowNull: false,
       
       },
    last_name:  {
      type: DataTypes.STRING, 
      allowNull: false,
      
      },
    email:  {
      type: DataTypes.STRING, 
      allowNull: false,
      unique: true
      
      },
    password:   {
      type: DataTypes.STRING, 
      allowNull: false,
      
      },
    username:   {
      type: DataTypes.STRING, 
      allowNull: false,
      unique: true
      
      },
    gender: {
      type: DataTypes.STRING, 
      allowNull: false,
      
      },
    role: {
      type: DataTypes.STRING, 
      allowNull: false,
      
      },
  }, {
    sequelize,
    modelName: 'User',
  });
  user.associate = (models) => {
    user.hasMany(models.Post); // ความสัมพันธ์ระหว่าง user และ Post
  };
  //console.log(user === sequelize.models.user); // true
  return user;
};