const jwt = require('jsonwebtoken');



/***
 * 
 *  verificacion del token 
 * 
 */

const verificaToken = (req, res, next) => {

    let token = req.get('Authorization');

    jwt.verify( token, process.env.SEED, ( err, decoded ) => {

        if ( err ) {
            return res.status(401).json({
                ok: false,
                err
            });
        }

        req.usuario = decoded.usuario;
        next();
    });

}

/**
 * 
 *      verificacion del rol del usuario
 * 
 */

const verificaRolUsuario = ( req, res, next ) => {
     
    let role = req.usuario.role;

    if ( role !== 'ADMIN_ROLE' ) {
        
        return res.status(401).json({
            ok: false,
            err: {
                message: 'El susuario no puede acceder a esta informacion'
            }
        });

    }else{

        next();

    }


}






module.exports = {
    verificaToken,
    verificaRolUsuario
}