const express = require('express');
const { body, param } = require('express-validator');
const controller = require('../controllers/visitaController');
const verifyToken = require('../middlewares/verifyToken');
const permitirPapeis = require('../middlewares/permitirPapeis');
const validate = require('../middlewares/validate');

const router = express.Router();

// Todas as rotas exigem token
router.use(verifyToken);

router.post(
  '/',
  permitirPapeis('CLIENTE'),
  [
    body('imovelId').isInt({ min: 1 }).withMessage('imovelId inválido.').toInt(),
    body('dataHora').isISO8601().withMessage('dataHora deve estar no formato ISO 8601 (ex: 2026-11-10T14:00:00Z).').toDate(),
  ],
  validate,
  controller.agendar
);

router.get('/', controller.listar);

router.delete(
  '/:id',
  permitirPapeis('CLIENTE'),
  [param('id').isInt({ min: 1 }).withMessage('ID inválido.').toInt()],
  validate,
  controller.cancelar
);

module.exports = router;
