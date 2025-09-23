const Efetivo = require('../models/efetivo');
const Vehicle = require('../models/vehicle');
const sequelize = require('../database');
const { Op } = require('sequelize');

class EfetivoController {
  // Listar todos os efetivo
  async index(req, res) {
    const efetivo = await Efetivo.findAll({
      order: [['name', 'ASC']],
      include: { association: 'vehicles' } // Inclui os veículos associados
    });
    return res.json(efetivo);
  }

  // Buscar um efetivo específico
  async show(req, res) {
    const { id } = req.params;
    const efetivo = await Efetivo.findByPk(id, {
      include: { association: 'vehicles' }
    });

    if (!efetivo) {
      return res.status(404).json({ error: 'efetivo not found.' });
    }
    return res.json(efetivo);
  }

  // Criar um novo Efetivo
  async store(req, res) {
    const { 
      re,
      name,
      postoGrad,
      rg,
      cpf,
      opm,
      funcao,
      secao,
      ramal,
      pgu,
      valCnh
     } = req.body;
    
    try {
      // Passa todos os campos para o método de criação
      const efetivo = await Efetivo.create({
        re,
        name,
        postoGrad,
        rg,
        cpf,
        opm,
        funcao,
        secao,
        ramal,
        pgu,
        valCnh
      });
      return res.status(201).json(efetivo);
    } catch (error) {

      // Verifica se é um erro de validação do Sequelize
      if (error.name === 'SequelizeValidationError') {
        // Mapeia os erros para uma mensagem mais clara
        const errors = error.errors.map(err => ({ field: err.path, message: err.message }));
        return res.status(400).json({ error: 'Validation error', details: errors });
      }
      
      // Para outros erros (como RE duplicado)
      if (error.name === 'SequelizeUniqueConstraintError') {
        const errors = error.errors.map(err => ({ field: err.path, message: `${err.path} já existe.` }));
        return res.status(400).json({ error: 'Validation error', details: errors });
      }

      console.error("Erro ao criar efetivo:", error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

   // --- NOVO MÉTODO COM TRANSAÇÃO ---
  async fullStore(req, res) {
    const t = await sequelize.transaction();
    try {
      // 1. Pega os dados do efetivo e do veículo do corpo da requisição
      const { efetivoData, vehicleData } = req.body;

      // 2. Cria o Efetivo
      const efetivo = await Efetivo.create(efetivoData, { transaction: t });

      // 3. Encontra o próximo número de cartão
      const lastVehicle = await Vehicle.findOne({
        order: [['card_number', 'DESC']],
        paranoid: false,
        transaction: t,
      });
      const nextCardNumber = lastVehicle ? lastVehicle.card_number + 1 : 1;

      // 4. Cria o Veículo, associando ao Efetivo recém-criado
      const vehicle = await Vehicle.create({
        ...vehicleData,
        efetivo_id: efetivo.id,
        card_number: nextCardNumber,
      }, { transaction: t });

      // Se tudo deu certo, confirma a transação
      await t.commit();

      // Retorna ambos os registros criados
      return res.status(201).json({ efetivo, vehicle });

    } catch (error) {
      // Se qualquer passo falhou, desfaz tudo
      await t.rollback();

      if (error.name === 'SequelizeUniqueConstraintError') {
        const errors = error.errors.map(err => ({ field: err.path, message: `${err.path} já existe.` }));
        return res.status(400).json({ error: 'Validation error', details: errors });
      }
      console.error("Erro no cadastro completo:", error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Atualizar um Efetivo
  async update(req, res) {
    const { id } = req.params;
    const efetivo = await Efetivo.findByPk(id);

    if (!efetivo) {
      return res.status(404).json({ error: 'Efetivo not found.' });
    }

    const updatedEfetivo = await efetivo.update(req.body);
    return res.json(updatedEfetivo);
  }

  // Deletar um Efetivo
  async delete(req, res) {
    const { id } = req.params;
    const efetivo = await Efetivo.findByPk(id);

    if (!efetivo) {
      return res.status(404).json({ error: 'Efetivo not found.' });
    }

    await efetivo.destroy();
    return res.status(204).send(); // 204: No Content
  }

  async searchByNameAndRE(req, res) {
    try {
      // Pega o nome da query string (ex: /search?name=joao)
      const { name, re } = req.query;
      
      // Cria um array para armazenar as condições de busca
      const searchConditions = [];

      //Adiciona a condição de busca por nome, se o parâmetro 'name'existir
      if (name) {
        searchConditions.push({
          name: {
            [Op.iLike]: `%${name}%` // Busca case-insensitive
          }
        });
      }

      // Adiciona a condição de busca por RE, se o parâmetro 're' exisitir
      if (re)  {
        searchConditions.push({
          re: {
            [Op.iLike]: `%${re}%`
          }
        })
      }

      // Se nenhum parâmetro de busca foi fornecido, retorna um array vazio
      if (searchConditions.length === 0) {
        return res.status(200).json([]);
      }

      // Executa a busca no banco de dados com as condições dinâmicas
      const efetivos = await Efetivo.findAll({
        where: {
          [Op.or]: searchConditions // Busca registros que atendam a QUALQUER uma das condições
        },
        limit: 20 //Limita a 20 resultados para não sobrecarregar
      });
      res.status(200).json(efetivos);

    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async search(req, res) {
    const { q } = req.query; // 'q' será nosso parâmetro de busca

    if (!q) {
      return res.status(400).json({ error: "Parâmetro de busca 'q' é obrigatório." });
    }

    try {
      const efetivos = await EfetivosService.findByNameOrRe(q);
      return res.json(efetivos);
    } catch (error) {
      return res.status(500).json({ error: "Erro ao buscar efetivos." });
    }
  }
}

module.exports = new EfetivoController();