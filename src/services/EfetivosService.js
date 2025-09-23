const { Op } = require("sequelize");
const Efetivo = require("../models/efetivo");

class EfetivoService {
 
    async findByNameOrRe(query) {
        const efetivos = await Efetivo.findAll({
            where: {
                [Op.or]: [
                    { name: { [Op.iLike]: `%${query}%` }}, // iLike não diferencia maiúsculas/minúsculas
                    { re: { [Op.iLike]: `%${query}%` }},
                ]
            },
            limit: 20 // Limita a 20 resultados para não sobrecarregar
        })
    }
}