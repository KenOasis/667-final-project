"use strict";

module.exports = (sequelize, DataTypes) => {
  const Games = sequelize.define('games', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.fn('NOW')
    },
    finished_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.fn('NOW')
    },
    name: {
      type: DataTypes.STRING(20),
      allowNull: false,
      validate: {
        len: [6, 20]
      }
    },
    direction: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      validate: {
        isIn: [[-1,1]]
      }
    }
  }, {
    timestamps: false
  });
  return Games;
}