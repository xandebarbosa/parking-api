const { Model, DataTypes } = require('sequelize');

class Efetivo extends Model {
  static init(sequelize) {
    super.init({
      re: { 
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
      },
      name: { 
        type: DataTypes.STRING,        
        allowNull: false,
      },
      postoGrad: { 
        type: DataTypes.STRING,        
        allowNull: false,
      },
      rg: { 
        type: DataTypes.STRING,        
        allowNull: false,
      },
      cpf: { 
        type: DataTypes.STRING,        
        allowNull: false,
      },
      opm: { 
        type: DataTypes.STRING,        
        allowNull: false,
      },
      funcao: { 
        type: DataTypes.STRING,        
        allowNull: false,
      },
      secao: { 
        type: DataTypes.STRING,        
        allowNull: false,
      },
      ramal: { 
        type: DataTypes.STRING,        
        allowNull: false,
      },
      pgu: { 
        type: DataTypes.STRING,        
        allowNull: false,
      },
      valCnh: {
        type: DataTypes.DATE,
        allowNull: false
      }
    }, {
      sequelize,
      modelName: 'Efetivo',
    });
    return this;
  }

  static associate(models) {
    this.hasMany(models.Vehicle, { foreignKey: 'efetivo_id', as: 'vehicles' });
  }
}

module.exports = Efetivo;