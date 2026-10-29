const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Imovel = sequelize.define(
  'Imovel',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    titulo: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },
    tipo: {
      type: DataTypes.ENUM('CASA', 'APARTAMENTO', 'TERRENO', 'COMERCIAL'),
      allowNull: false,
    },
    preco: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
    },
    endereco: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('DISPONIVEL', 'RESERVADO', 'VENDIDO', 'ALUGADO'),
      allowNull: false,
      defaultValue: 'DISPONIVEL',
    },
    // id do corretor no auth-service (sem FK, pois é outro banco)
    corretorId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  { tableName: 'imoveis' }
);

module.exports = Imovel;
