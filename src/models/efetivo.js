'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Efetivo extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Um Cliente (Efetivo) pode ter muitos Veículos
      this.hasMany(models.Vehicle, { foreignKey: 'efetivo_id', as: 'vehicles' });
    }
  }
  Efetivo.init({
    re: DataTypes.STRING,
    name: DataTypes.STRING,
    postoGrad: DataTypes.STRING,
    rg: DataTypes.STRING,
    cpf: DataTypes.STRING,
    opm: DataTypes.STRING,
    funcao: DataTypes.STRING,
    secao: DataTypes.STRING,
    ramal: DataTypes.STRING,
    pgu: DataTypes.STRING,
    valCnh: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Efetivo',
  });
  return Efetivo;
};