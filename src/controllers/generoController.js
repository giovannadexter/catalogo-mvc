const express = require('express');
const { Genero } = require('../models/generoModel');
const router = express.Router();
const { Op } = require('sequelize');

// Listar gêneros
router.get('/', async (req, res) => {
  try {
    const generos = await Genero.findAll();
    res.render('generos', { generos });
  } catch (error) {
    console.error('Erro ao listar gêneros:', error);
    res.status(500).send('Erro ao listar gêneros.');
  }
});

// Buscar gêneros com filtros
router.get('/search', async (req, res) => {
  try {
    const { name } = req.query;

    const whereClause = {};
    if (name) whereClause.name = { [Op.like]: `%${name}%` };

    const generos = await Genero.findAll({ where: whereClause });

    res.render('generos', { generos });
  } catch (error) {
    console.error('Erro ao buscar gêneros:', error);
    res.status(500).send('Erro ao buscar gêneros.');
  }
});

// Editar gênero
router.post('/edit/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    await Genero.update({ name, description }, { where: { id } });

    res.redirect('/generos');
  } catch (error) {
    console.error('Erro ao editar gênero:', error);
    res.status(500).send('Erro ao editar gênero.');
  }
});

// Remover gênero
router.post('/delete/:id', async (req, res) => {
  try {
    const { id } = req.params;

    await Genero.destroy({ where: { id } });

    res.redirect('/generos');
  } catch (error) {
    console.error('Erro ao remover gênero:', error);
    res.status(500).send('Erro ao remover gênero.');
  }
});

module.exports = router;
