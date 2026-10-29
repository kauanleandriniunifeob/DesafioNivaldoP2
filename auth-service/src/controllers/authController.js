const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');

const SALT_ROUNDS = 10;

// POST /auth/register
async function register(req, res) {
  try {
    const { nome, email, senha, papel } = req.body;

    const existente = await Usuario.findOne({ where: { email } });
    if (existente) {
      return res.status(409).json({ erro: 'E-mail já cadastrado.' });
    }

    const senhaHash = await bcrypt.hash(senha, SALT_ROUNDS);

    const usuario = await Usuario.create({
      nome,
      email,
      senhaHash,
      papel: papel || 'CLIENTE',
    });

    return res.status(201).json(usuario);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ erro: 'Erro interno ao cadastrar usuário.' });
  }
}

// POST /auth/login
async function login(req, res) {
  try {
    const { email, senha } = req.body;

    const usuario = await Usuario.findOne({ where: { email } });

    // Mesma mensagem para e-mail ou senha errados (não revela qual deles falhou)
    if (!usuario || !(await bcrypt.compare(senha, usuario.senhaHash))) {
      return res.status(401).json({ erro: 'E-mail ou senha incorretos.' });
    }

    const token = jwt.sign(
      { id: usuario.id, papel: usuario.papel },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '2h' }
    );

    return res.status(200).json({ token, usuario });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ erro: 'Erro interno ao fazer login.' });
  }
}

// GET /auth/me  (rota protegida)
async function me(req, res) {
  try {
    const usuario = await Usuario.findByPk(req.usuario.id);

    if (!usuario) {
      return res.status(404).json({ erro: 'Usuário não encontrado.' });
    }

    return res.status(200).json(usuario);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ erro: 'Erro interno.' });
  }
}

module.exports = { register, login, me };
