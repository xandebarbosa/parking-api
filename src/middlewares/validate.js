const validate = (schema) => async (req, res, next) => {
  try {
    await schema.parseAsync(req.body);
    return next();
  } catch (error) {
    // Formata o erro do Zod para o formato que seu frontend espera
    const details = error.errors.map(err => ({
      field: err.path.join('.'),
      message: err.message,
    }));
    return res.status(400).json({ error: "Erro de Validação", details });
  }
};

module.exports = validate;