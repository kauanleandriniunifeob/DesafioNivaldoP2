const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

// Model pronto; as rotas e regras de Proposta ficam para a próxima etapa.
const Proposta = sequelize.define(
  'Proposta',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    valor: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('PENDENTE', 'ACEITA', 'RECUSADA'),
      allowNull: false,
      defaultValue: 'PENDENTE',
    },
    imovelId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    // id do cliente no auth-service
    clienteId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  { tableName: 'propostas' }
);

module.exports = Proposta;
