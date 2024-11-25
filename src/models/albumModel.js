const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Album = sequelize.define('Album', {
  title: { type: DataTypes.STRING, allowNull: false },
  releaseYear: { type: DataTypes.INTEGER, allowNull: false },
  cover: { type: DataTypes.STRING },
  tracks: {
    type: DataTypes.TEXT,
    allowNull: true,
    get() {
      const rawValue = this.getDataValue('tracks');
      return rawValue ? JSON.parse(rawValue) : [];
    },
    set(value) {
      this.setDataValue('tracks', JSON.stringify(value));
    },
  },
});

module.exports = { Album };
