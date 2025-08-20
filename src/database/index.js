const Sequelize = require('sequelize');
const dbConfig = require('../config/database');

const User = require('../models/user');
const Efetivo = require('../models/efetivo');
const Vehicle = require('../models/vehicle');

// Ajuste para usar a configuração de 'development' ou 'production'
const environment = process.env.NODE_ENV || 'development';
const connection = new Sequelize(dbConfig[environment]);

User.init(connection);
Efetivo.init(connection);
Vehicle.init(connection);

Efetivo.associate(connection.models);
Vehicle.associate(connection.models);

module.exports = connection;