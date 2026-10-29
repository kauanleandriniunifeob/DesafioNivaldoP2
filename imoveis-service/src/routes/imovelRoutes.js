const express = require('express');
const { body, param, query } = require('express-validator');
const controller = require('../controllers/imovelController');
const verifyToken = require('../middlewares/verifyToken');
const permitirPapeis = require('../middlewares/permitirPapeis');
const validate = require('../middlewares/validate');

const router = express.Router();

const TIPOS = ['CASA', 'APARTAMENTO', 'TERRENO', 'COMERCIAL'];
const STATUS = ['DISPONIVEL', 'RESERVADO', 'VENDIDO', 'ALUGADO'];

const validarId = param('id').isInt({ min: 1 }).withMessage('ID inválido.').toInt();

// Todas as rotas exigem token
router.use(verifyToken);

router.get(
  '/',
  [
    query('tipo').optional().isIn(TIPOS).withMessage(`Tipo deve ser: ${TIPOS.join(', ')}.`),
    query('status').optional().isIn(STATUS).withMessage(`Status deve ser: ${STATUS.join(', ')}.`),
  ],
  validate,
  controller.listar
);

router.get('/:id', [validarId], validate, controller.buscarPorId);

router.post(
  '/',
  permitirPapeis('CORRETOR'),
  [
    body('titulo').trim().notEmpty().withMessage('Título é obrigatório.')
      .isLength({ max: 150 }).withMessage('Título deve ter no máximo 150 caracteres.'),
    body('tipo').isIn(TIPOS).withMessage(`Tipo deve ser: ${TIPOS.join(', ')}.`),
    body('preco').isFloat({ gt: 0 }).withMessage('Preço deve ser maior que zero.').toFloat(),
    body('endereco').trim().notEmpty().withMessage('Endereço é obrigatório.')
      .isLength({ max: 255 }).withMessage('Endereço deve ter no máximo 255 caracteres.'),
  ],
  validate,
  controller.criar
);

router.put(
  '/:id',
  permitirPapeis('CORRETOR'),
  [
    validarId,
    body('titulo').optional().trim().notEmpty().withMessage('Título não pode ser vazio.')
      .isLength({ max: 150 }).withMessage('Título deve ter no máximo 150 caracteres.'),
    body('tipo').optional().isIn(TIPOS).withMessage(`Tipo deve ser: ${TIPOS.join(', ')}.`),
    body('preco').optional().isFloat({ gt: 0 }).withMessage('Preço deve ser maior que zero.').toFloat(),
    body('endereco').optional().trim().notEmpty().withMessage('Endereço não pode ser vazio.')
      .isLength({ max: 255 }).withMessage('Endereço deve ter no máximo 255 caracteres.'),
    body('status').optional().isIn(STATUS).withMessage(`Status deve ser: ${STATUS.join(', ')}.`),
  ],
  validate,
  controller.atualizar
);

router.delete('/:id', permitirPapeis('CORRETOR'), [validarId], validate, controller.remover);

module.exports = router;
