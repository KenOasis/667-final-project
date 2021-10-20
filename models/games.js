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
      defaultValue: sequelize.fn('NOW()')
    },
    finished_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.fn('NOW()')
    },
    name: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: sequelize.fn('NOW()')
    },
    direction: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isIn: [[-1,1]]
      }
    }
  }, {
    timestamps: false
  });
  return Games;
}