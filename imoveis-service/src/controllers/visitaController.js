const { Op } = require('sequelize');
const { Imovel, Visita } = require('../models');

const DURACAO_VISITA_MS = 60 * 60 * 1000; // cada visita ocupa 1 hora

// POST /visitas  (CLIENTE)
async function agendar(req, res) {
  try {
    const { imovelId, dataHora } = req.body; // dataHora já convertida para Date pelo validator

    if (dataHora <= new Date()) {
      return res.status(400).json({ erro: 'A data da visita deve ser no futuro.' });
    }

    const imovel = await Imovel.findByPk(imovelId);
    if (!imovel) {
      return res.status(404).json({ erro: 'Imóvel não encontrado.' });
    }

    if (imovel.status !== 'DISPONIVEL') {
      return res.status(409).json({ erro: 'Este imóvel não está disponível para visitas.' });
    }

    // Regra de negócio: não pode haver duas visitas no mesmo horário para o mesmo imóvel
    const conflito = await Visita.findOne({
      where: {
        imovelId,
        dataHora: {
          [Op.gt]: new Date(dataHora.getTime() - DURACAO_VISITA_MS),
          [Op.lt]: new Date(dataHora.getTime() + DURACAO_VISITA_MS),
        },
      },
    });

    if (conflito) {
      return res.status(409).json({ erro: 'Já existe uma visita marcada para este imóvel nesse horário.' });
    }

    const visita = await Visita.create({
      imovelId,
      dataHora,
      clienteId: req.usuario.id, // vem do token
    });

    return res.status(201).json(visita);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ erro: 'Erro interno ao agendar visita.' });
  }
}

// GET /visitas
//  - CLIENTE: vê só as próprias visitas
//  - CORRETOR: vê as visitas dos imóveis que cadastrou
async function listar(req, res) {
  try {
    let visitas;

    if (req.usuario.papel === 'CLIENTE') {
      visitas = await Visita.findAll({
        where: { clienteId: req.usuario.id },
        include: [{ model: Imovel, as: 'imovel' }],
        order: [['dataHora', 'ASC']],
      });
    } else {
      visitas = await Visita.findAll({
        include: [{ model: Imovel, as: 'imovel', where: { corretorId: req.usuario.id } }],
        order: [['dataHora', 'ASC']],
      });
    }

    return res.status(200).json(visitas);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ erro: 'Erro interno ao listar visitas.' });
  }
}

// DELETE /visitas/:id  (CLIENTE dono da visita)
async function cancelar(req, res) {
  try {
    const visita = await Visita.findByPk(req.params.id);
    if (!visita) {
      return res.status(404).json({ erro: 'Visita não encontrada.' });
    }

    if (visita.clienteId !== req.usuario.id) {
      return res.status(403).json({ erro: 'Você só pode cancelar as suas próprias visitas.' });
    }

    await visita.destroy();
    return res.status(204).send();
  } catch (err) {
    console.error(err);
    return res.status(500).json({ erro: 'Erro interno ao cancelar visita.' });
  }
}

module.exports = { agendar, listar, cancelar };
