const { validationResult } = require('express-validator');

// Se alguma regra do express-validator falhou, responde 400 com a lista de erros
function validate(req, res, next) {
  const erros = validationResult(req);

  if (!erros.isEmpty()) {
    return res.status(400).json({
      erro: 'Dados inválidos.',
      detalhes: erros.array().map((e) => ({ campo: e.path, mensagem: e.msg })),
    });
  }

  next();
}

module.exports = validate;
