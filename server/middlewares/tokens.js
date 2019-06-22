const jwt = require('jsonwebtoken');

///////////////////
//Verificar token//
///////////////////
const verificarToken = (req, res, next) => {

    let token = req.get('token');


    jwt.verify(token, process.env.SEED, (err, decoded) => {

        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token no valido'
                }
            });
        }

        req.caca = decoded.caca;
        next();
    });

};
////////////////////////
//Verificar admin role//
////////////////////////
const verificaAdminRole = (req, res, next) => {
    let caca = req.caca;

    if (caca.role === 'ADMIN_ROLE') {
        next();
    } else {
        return res.json({
            ok: false,
            err: {
                message: 'El usuario no es administrador'
            }
        });
    }

};


module.exports = {
    verificarToken,
    verificaAdminRole
};