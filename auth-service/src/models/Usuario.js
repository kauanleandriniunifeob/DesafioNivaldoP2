const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Usuario = sequelize.define(
  'Usuario',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    nome: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(150),
      allowNull: false,
      unique: true,
    },
    senhaHash: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    papel: {
      type: DataTypes.ENUM('CLIENTE', 'CORRETOR'),
      allowNull: false,
      defaultValue: 'CLIENTE',
    },
  },
  {
    tableName: 'usuarios',
  }
);

// Nunca devolver o hash da senha nas respostas
Usuario.prototype.toJSON = function () {
  const dados = { ...this.get() };
  delete dados.senhaHash;
  return dados;
};

module.exports = Usuario;
