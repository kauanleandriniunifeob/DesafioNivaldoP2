require('dotenv').config();
const app = require('./app');
const sequelize = require('./config/database');
require('./models'); // registra os models e as associações

const PORT = process.env.PORT || 3002;

async function iniciar() {
  try {
    await sequelize.authenticate();
    await sequelize.sync(); // cria as tabelas se ainda não existirem
    console.log('imoveis-service: banco conectado.');

    app.listen(PORT, () => console.log(`imoveis-service rodando na porta ${PORT}`));
  } catch (err) {
    console.error('Falha ao iniciar o imoveis-service:', err.message);
    process.exit(1);
  }
}

iniciar();
