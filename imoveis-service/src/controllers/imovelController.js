const { Imovel } = require('../models');

const CAMPOS_EDITAVEIS = ['titulo', 'tipo', 'preco', 'endereco', 'status'];

// GET /imoveis?tipo=CASA&status=DISPONIVEL  (qualquer usuário autenticado)
async function listar(req, res) {
  try {
    const where = {};
    if (req.query.tipo) where.tipo = req.query.tipo;
    if (req.query.status) where.status = req.query.status;

    const imoveis = await Imovel.findAll({ where, order: [['id', 'DESC']] });
    return res.status(200).json(imoveis);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ erro: 'Erro interno ao listar imóveis.' });
  }
}

// GET /imoveis/:id
async function buscarPorId(req, res) {
  try {
    const imovel = await Imovel.findByPk(req.params.id);
    if (!imovel) {
      return res.status(404).json({ erro: 'Imóvel não encontrado.' });
    }
    return res.status(200).json(imovel);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ erro: 'Erro interno ao buscar imóvel.' });
  }
}

// POST /imoveis  (CORRETOR)
async function criar(req, res) {
  try {
    const { titulo, tipo, preco, endereco } = req.body;

    const imovel = await Imovel.create({
      titulo,
      tipo,
      preco,
      endereco,
      corretorId: req.usuario.id, // vem do token, nunca do body
    });

    return res.status(201).json(imovel);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ erro: 'Erro interno ao criar imóvel.' });
  }
}

// PUT /imoveis/:id  (CORRETOR dono do imóvel)
async function atualizar(req, res) {
  try {
    const imovel = await Imovel.findByPk(req.params.id);
    if (!imovel) {
      return res.status(404).json({ erro: 'Imóvel não encontrado.' });
    }

    if (imovel.corretorId !== req.usuario.id) {
      return res.status(403).json({ erro: 'Você só pode editar os imóveis que cadastrou.' });
    }

    const dados = {};
    CAMPOS_EDITAVEIS.forEach((campo) => {
      if (req.body[campo] !== undefined) dados[campo] = req.body[campo];
    });

    await imovel.update(dados);
    return res.status(200).json(imovel);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ erro: 'Erro interno ao atualizar imóvel.' });
  }
}

// DELETE /imoveis/:id  (CORRETOR dono do imóvel)
async function remover(req, res) {
  try {
    const imovel = await Imovel.findByPk(req.params.id);
    if (!imovel) {
      return res.status(404).json({ erro: 'Imóvel não encontrado.' });
    }

    if (imovel.corretorId !== req.usuario.id) {
      return res.status(403).json({ erro: 'Você só pode remover os imóveis que cadastrou.' });
    }

    await imovel.destroy();
    return res.status(204).send();
  } catch (err) {
    console.error(err);
    return res.status(500).json({ erro: 'Erro interno ao remover imóvel.' });
  }
}

module.exports = { listar, buscarPorId, criar, atualizar, remover };
