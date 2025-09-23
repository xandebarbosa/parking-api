module.exports = (req, res, next) => {
    if (req.userRole && req.userRole === 'admin') {
        return next();
    }

    return res.status(403).json({ error: 'Acesso negado. Requer permissão de administrador.' });
};