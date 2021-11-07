"use strict";

module.exports = (sequelize, DataTypes) => {
  const Session = sequelize.define('sessions', {
    sid: {
      type: DataTypes.STRING,
      primaryKey: true
    },
    userId: DataTypes.INTEGER,
    expires: DataTypes.DATE,
    data: DataTypes.TEXT,
    userName: DataTypes.STRING(20),
    userStatus: DataTypes.STRING(20),
  }, {
    timestamps: false
  });

  return Session; 
}