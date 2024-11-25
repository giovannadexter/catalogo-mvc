const sequelize = require('../config/database');
const { Album } = require('./albumModel');
const { Artista } = require('./artistaModel');

// Configurar associações
Album.belongsToMany(Artista, { through: 'AlbumArtists' });
Artista.belongsToMany(Album, { through: 'AlbumArtists' });

module.exports = {
  sequelize,
  Album,
  Artista,
};
