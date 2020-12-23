/**
 * 
 *      ARCHIVO DE CONFIGURACION GLOBAL.
 * 
 */

/**
 * 
 *             PUERTO.
 * 
 */


process.env.PORT = process.env.PORT || '3000';

/**
 * 
 * 
 *      ENTORNO
 * 
 * 
 */

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

/**
 * 
 * 
 *     BASE DE DATOS
 * 
 */

let linkDB;

if (process.env.NODE_ENV === 'dev') {

    linkDB = 'mongodb://localhost:27017/cafe';

} else {

    linkDB = process.env.MONGO_URL;

}

process.env.URL_DB = linkDB;


/**
 * 
 * 
 *     vencimiento del token 
 * 
 */
 // expiracion en 30 dias -segundos - minutos- -horas -dias
 process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;


 /**
 * 
 * 
 *     SEED de autenticacion 
 * 
 */
process.env.SEED = process.env.SEED || 'secret-key-desarrollo';


/**
 * 
 *      Google Client ID
 * 
 */


process.env.CLIENT_ID = process.env.CLIENT_ID || '995797483734-p8slgbbin0u19bosejvp9ajvdlrdff7i.apps.googleusercontent.com';

