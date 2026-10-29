// Autorização por papel. Use depois do verifyToken:
//   router.post('/', verifyToken, permitirPapeis('CORRETOR'), controller)
function permitirPapeis(...papeis) {
  return (req, res, next) => {
    if (!req.usuario || !papeis.includes(req.usuario.papel)) {
      return res.status(403).json({
        erro: `Acesso negado. Permitido apenas para: ${papeis.join(', ')}.`,
      });
    }
    next();
  };
}

module.exports = permitirPapeis;
