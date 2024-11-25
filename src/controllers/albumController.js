const express = require('express');
const { Album } = require('../models'); // Importar modelo Album
const router = express.Router();
const { Op } = require('sequelize');


router.get('/', async (req, res) => {
  try {
    const albuns = await Album.findAll();
    res.render('albuns', { albuns });
  } catch (error) {
    console.error('Erro ao listar álbuns:', error);
    res.status(500).send('Erro ao listar álbuns.');
  }
});

router.get('/search', async (req, res) => {
  try {
    const { title, artist, genre } = req.query;

    // Filtros baseados em parâmetros da query
    const whereClause = {};
    if (title) whereClause.title = { [Op.like]: `%${title}%` }; // Filtro pelo título
    if (artist) whereClause['$Artists.name$'] = { [Op.like]: `%${artist}%` }; // Filtro pelo nome do artista
    if (genre) whereClause['$Genres.name$'] = { [Op.like]: `%${genre}%` }; // Filtro pelo nome do gênero

    // Buscar álbuns com filtros e associações
    const albuns = await Album.findAll({
      where: whereClause,
      include: [{ model: Artista }, { model: Genero }],
    });

    res.render('albuns', { albuns });
  } catch (error) {
    console.error('Erro ao buscar álbuns:', error);
    res.status(500).send('Erro ao buscar álbuns.');
  }
});


router.post('/add', async (req, res) => {
  try {
    const { title, releaseYear, cover, tracks } = req.body;
    await Album.create({
      title,
      releaseYear,
      cover,
      tracks: tracks ? tracks.split(',').map(t => t.trim()) : [],
    });
    res.redirect('/albuns');
  } catch (error) {
    console.error('Erro ao adicionar álbum:', error);
    res.status(500).send('Erro ao adicionar álbum.');
  }
});

router.post('/edit/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, releaseYear, cover, tracks } = req.body;

    await Album.update(
      { title, releaseYear, cover, tracks },
      { where: { id } }
    );

    res.redirect('/albuns');
  } catch (error) {
    console.error('Erro ao editar álbum:', error);
    res.status(500).send('Erro ao editar álbum.');
  }
});

// Remover álbum
router.post('/delete/:id', async (req, res) => {
  try {
    const { id } = req.params;

    await Album.destroy({ where: { id } });

    res.redirect('/albuns');
  } catch (error) {
    console.error('Erro ao remover álbum:', error);
    res.status(500).send('Erro ao remover álbum.');
  }
});

module.exports = router;
