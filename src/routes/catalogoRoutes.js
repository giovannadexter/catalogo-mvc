const express = require('express');
const router = express.Router();
const artistaRoutes = require('./controllers/artistaController');
app.use('/artistas', artistaRoutes);


router.get('/', albumController.getAlbums);
router.post('/add', albumController.addAlbum);
router.post('/delete/:id', albumController.deleteAlbum);


module.exports = router;
