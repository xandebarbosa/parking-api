const { Router } = require('express');

// Middlewares
const authMiddleware = require('../middlewares/auth');
const adminMiddleware = require('../middlewares/adminMiddleware'); //middleware para bloqueio acesso para admin

// Controllers
const UserController = require('../controllers/UserController');
const SessionController = require('../controllers/SessionController');
const EfetivoController = require('../controllers/EfetivoController');
const VehicleController = require('../controllers/VehicleController');

const routes = new Router();

// --- Rotas Públicas ---
routes.post('/sessions', SessionController.store);
routes.post('/users', UserController.store);

// --- Middleware de Autenticação ---
// Todas as rotas abaixo desta linha estarão protegidas por JWT
routes.use(authMiddleware);

// --- Rotas Protegidas ---

// Rotas para Usuário
routes.put('/users', UserController.update);
routes.get('/users', adminMiddleware, UserController.index);
routes.delete('/users/:id', adminMiddleware ,UserController.delete);

// Rotas para Efetivo
routes.get('/efetivos', EfetivoController.index);
routes.get('/efetivos/search', EfetivoController.searchByNameAndRE);
routes.post('/efetivos', EfetivoController.store);
routes.get('/efetivos/:id', EfetivoController.show);
routes.put('/efetivos/:id', EfetivoController.update);
routes.delete('/efetivos/:id', EfetivoController.delete);

// Rotas para Veículos (associados a um Efetivo)
routes.get('/vehicles', VehicleController.listAll);

routes.get('/vehicles/next-card-number', VehicleController.getNextCardNumber);
routes.post('/full-cadastro', EfetivoController.fullStore);

routes.get('/efetivos/:efetivo_id/vehicles', VehicleController.index);
routes.post('/efetivos/:efetivo_id/vehicles', VehicleController.store);
routes.put('/vehicles/:id', VehicleController.update);
routes.delete('/vehicles/:id', VehicleController.delete);

routes.get('/vehicles/by-card-number/:number', VehicleController.findByCardNumber);


module.exports = routes;