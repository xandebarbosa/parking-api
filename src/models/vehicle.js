'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Vehicle extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Um Veículo pertence a um Cliente (Efetivo)
      this.belongsTo(models.Client, { foreignKey: 'efetivo_id', as: 'efetivo' });
    }
  }
  Vehicle.init({
    placa: DataTypes.STRING,
    modelo: DataTypes.STRING,
    color: DataTypes.STRING,
    ano: DataTypes.STRING,
    municipio: DataTypes.STRING,
    uf: DataTypes.STRING,
    chassi: DataTypes.STRING,
    renavan: DataTypes.STRING,
    reFiscalizador: DataTypes.STRING,
    periodo1Entrada: DataTypes.TIME,
    periodo1Saida: DataTypes.TIME,
    periodo2Entrada: DataTypes.TIME,
    periodo2Saida: DataTypes.TIME,
    dias: DataTypes.INTEGER,
    validadeCartao: DataTypes.DATE,
    efetivo_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Vehicle',
  });
  return Vehicle;
};