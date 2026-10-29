require('dotenv').config();
const app = require('./app');
const sequelize = require('./config/database');
require('./models/Usuario');

const PORT = process.env.PORT || 3001;

async function iniciar() {
  try {
    await sequelize.authenticate();
    await sequelize.sync(); // cria a tabela se ainda não existir
    console.log('auth-service: banco conectado.');

    app.listen(PORT, () => console.log(`auth-service rodando na porta ${PORT}`));
  } catch (err) {
    console.error('Falha ao iniciar o auth-service:', err.message);
    process.exit(1);
  }
}

iniciar();
