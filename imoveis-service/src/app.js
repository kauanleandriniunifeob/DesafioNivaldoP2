require('dotenv').config();
const express = require('express');
const imovelRoutes = require('./routes/imovelRoutes');
const visitaRoutes = require('./routes/visitaRoutes');

const app = express();

app.use(express.json());

app.get('/', (req, res) => res.json({ servico: 'imoveis-service', status: 'ok' }));
app.use('/imoveis', imovelRoutes);
app.use('/visitas', visitaRoutes);

// Rota não encontrada
app.use((req, res) => res.status(404).json({ erro: 'Rota não encontrada.' }));

// JSON malformado no body e outros erros
app.use((err, req, res, next) => {
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ erro: 'JSON inválido no corpo da requisição.' });
  }
  console.error(err);
  return res.status(500).json({ erro: 'Erro interno.' });
});

module.exports = app;
