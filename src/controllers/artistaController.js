const express = require('express');
const { Artista } = require('../models/artistaModel');
const { Album } = require('../models/albumModel'); // Importar o modelo Album
const router = express.Router();
const { Op } = require('sequelize');

// Listar artistas
router.get('/', async (req, res) => {
  try {
    // Buscar todos os artistas
    const artistas = await Artista.findAll();

    // Buscar todos os álbuns disponíveis
    const albuns = await Album.findAll();

    // Passar artistas e álbuns para a view
    res.render('artistas', { artistas, albuns });
  } catch (error) {
    console.error('Erro ao listar artistas ou álbuns:', error);
    res.status(500).send('Erro ao listar artistas ou álbuns.');
  }
});

// Buscar artistas com filtros
router.get('/search', async (req, res) => {
  try {
    const { name, genre } = req.query;

    const whereClause = {};
    if (name) whereClause.name = { [Op.like]: `%${name}%` };
    if (genre) whereClause.genre = { [Op.like]: `%${genre}%` };

    const artistas = await Artista.findAll({ where: whereClause });

    res.render('artistas', { artistas });
  } catch (error) {
    console.error('Erro ao buscar artistas:', error);
    res.status(500).send('Erro ao buscar artistas.');
  }
});

// Editar artista
router.post('/add', async (req, res) => {
  try {
    const { name, genre, albums } = req.body;

    // Criar o artista
    const artista = await Artista.create({ name, genre });

    // Verificar se há álbuns selecionados e associá-los ao artista
    if (albums) {
      const albumIds = Array.isArray(albums) ? albums : [albums]; // Certificar-se de que é um array
      const albumsToAdd = await Album.findAll({ where: { id: albumIds } });
      await artista.addAlbums(albumsToAdd);
    }

    res.redirect('/artistas'); // Redirecionar para a lista de artistas
  } catch (error) {
    console.error('Erro ao adicionar artista:', error);
    res.status(500).send('Erro ao adicionar artista.');
  }
});

// Remover artista
router.post('/delete/:id', async (req, res) => {
  try {
    const { id } = req.params;

    await Artista.destroy({ where: { id } });

    res.redirect('/artistas');
  } catch (error) {
    console.error('Erro ao remover artista:', error);
    res.status(500).send('Erro ao remover artista.');
  }
});

module.exports = router;
