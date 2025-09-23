const { Model, DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');

class User extends Model {
  static init(sequelize) {
    super.init({
      name: DataTypes.STRING,
      email: DataTypes.STRING,
      password: {
        type: DataTypes.VIRTUAL,
      },
      password_hash: DataTypes.STRING,
      role: {
        type: DataTypes.STRING,
        defaultValue: 'user', // O valor padrão que está sendo aplicado
        allowNull: false,
      },
    }, {
      sequelize,
      modelName: 'User',
    });

    this.addHook('beforeSave', async (user) => {
      if (user.password) {
        user.password_hash = await bcrypt.hash(user.password, 8);
      }
    });

    return this;
  }

  checkPassword(password) {
    return bcrypt.compare(password, this.password_hash);
  }
}

module.exports = User;