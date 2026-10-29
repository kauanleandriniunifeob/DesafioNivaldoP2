require('dotenv').config();
const express = require('express');
const authRoutes = require('./routes/authRoutes');

const app = express();

app.use(express.json());

app.get('/', (req, res) => res.json({ servico: 'auth-service', status: 'ok' }));
app.use('/auth', authRoutes);

// Rota não encontrada
app.use((req, res) => res.status(404).json({ erro: 'Rota não encontrada.' }));

module.exports = app;
