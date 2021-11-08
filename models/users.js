"use strict";

module.exports = (sequelize, DataTypes) => {
  const Users = sequelize.define('users', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    username: {
      type: DataTypes.STRING(20),
      unique: true,
      allowNull: false,
      validate: {
        len: [3, 20]
      }
    },
    email: {
      type: DataTypes.STRING(65),
      unique: true,
      allowNull: false,
      validate: {
        isEmail: true
      }
    },
    password: {
      type: DataTypes.STRING(256),
      allowNull: false,
      validate: {
        len: [8, 256]
      }
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.fn('NOW'),
      validate: {
        isDate: true
      }
    }
  }, {
    timestamps: false
  });
  return Users;
}