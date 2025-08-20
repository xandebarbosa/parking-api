const { Model, DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');

class User extends Model {
  static init(sequelize) {
    super.init({
      name: DataTypes.STRING,
      email: DataTypes.STRING,
      password: {
        type: DataTypes.VIRTUAL,
        allowNull: false,
      },
      password_hash: DataTypes.STRING,
    }, {
      sequelize,
    });

    this.addHook('beforeSave', async (user) => {
      if (user.password) {
        user.password_hash = await bcrypt.hash(user.password, 8);
      }
    });

    return this;
  }

  // Método para verificar a senha no momento do login
  checkPassword(password) {
    return bcrypt.compare(password, this.password_hash);
  }
}

module.exports = User;