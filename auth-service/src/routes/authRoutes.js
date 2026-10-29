const express = require('express');
const { body } = require('express-validator');
const { register, login, me } = require('../controllers/authController');
const verifyToken = require('../middlewares/verifyToken');
const validate = require('../middlewares/validate');

const router = express.Router();

router.post(
  '/register',
  [
    body('nome')
      .trim()
      .notEmpty().withMessage('Nome é obrigatório.')
      .isLength({ max: 100 }).withMessage('Nome deve ter no máximo 100 caracteres.'),
    body('email')
      .trim()
      .isEmail().withMessage('E-mail inválido.')
      .normalizeEmail(),
    body('senha')
      .isLength({ min: 6 }).withMessage('Senha deve ter no mínimo 6 caracteres.'),
    body('papel')
      .optional()
      .isIn(['CLIENTE', 'CORRETOR']).withMessage('Papel deve ser CLIENTE ou CORRETOR.'),
  ],
  validate,
  register
);

router.post(
  '/login',
  [
    body('email').trim().isEmail().withMessage('E-mail inválido.').normalizeEmail(),
    body('senha').notEmpty().withMessage('Senha é obrigatória.'),
  ],
  validate,
  login
);

router.get('/me', verifyToken, me);

module.exports = router;
