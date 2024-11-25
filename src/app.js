const express = require('express');
const bodyParser = require('body-parser');
const sequelize = require('./config/database');
const path = require('path');

const app = express();

// Configuração do EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middlewares
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Testar conexão com o banco de dados
sequelize
  .sync()
  .then(() => console.log('Banco de dados sincronizado!'))
  .catch((err) => console.error('Erro ao sincronizar o banco de dados:', err));

// Rotas principais
const albumRoutes = require('./controllers/albumController');
const artistRoutes = require('./controllers/artistaController');
const genreRoutes = require('./controllers/generoController');

app.use('/albuns', albumRoutes);
app.use('/artistas', artistRoutes);
app.use('/generos', genreRoutes);

// Rota principal
app.get('/', (req, res) => {
  res.render('home', { title: 'Catálogo de Discos' });
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
