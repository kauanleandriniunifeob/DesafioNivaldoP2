const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Visita = sequelize.define(
  'Visita',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    dataHora: {
      type: DataTypes.DATE,
      allowNull: false,
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
  { tableName: 'visitas' }
);

module.exports = Visita;
