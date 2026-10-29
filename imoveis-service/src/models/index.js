const Imovel = require('./Imovel');
const Visita = require('./Visita');
const Proposta = require('./Proposta');

// Um imóvel recebe várias visitas e várias propostas
Imovel.hasMany(Visita, { foreignKey: 'imovelId', as: 'visitas', onDelete: 'CASCADE' });
Visita.belongsTo(Imovel, { foreignKey: 'imovelId', as: 'imovel' });

Imovel.hasMany(Proposta, { foreignKey: 'imovelId', as: 'propostas', onDelete: 'CASCADE' });
Proposta.belongsTo(Imovel, { foreignKey: 'imovelId', as: 'imovel' });

module.exports = { Imovel, Visita, Proposta };
