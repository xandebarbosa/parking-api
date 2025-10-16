// Este middleware irá capturar os erros da aplicação
module.exports = (error, req, res, next) => {
  // Loga o erro no console para depuração (importante em desenvolvimento)
  console.error(error);

  // Se o erro for do Sequelize (validação ou constraint única)
  if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
    const details = error.errors.map(err => ({
      field: err.path,
      message: err.message,
    }));
    return res.status(400).json({ error: "Erro de Validação", details });
  }
  
  // Para todos os outros erros, retorna uma resposta genérica de "Erro Interno"
  return res.status(500).json({ error: 'Erro interno do servidor.' });
};