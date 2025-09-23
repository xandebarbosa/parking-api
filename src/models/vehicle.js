const { Model, DataTypes } = require('sequelize');

class Vehicle extends Model {
  static init(sequelize) {
    super.init({
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
      efetivo_id: DataTypes.INTEGER,
      card_number: DataTypes.INTEGER,
      local: DataTypes.STRING
    }, {
      sequelize,
      modelName: 'Vehicle',
    });
    return this;
  }

  static associate(models) {
    this.belongsTo(models.Efetivo, { foreignKey: 'efetivo_id', as: 'efetivo' });
  }
}

module.exports = Vehicle;