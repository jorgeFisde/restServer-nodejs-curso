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

    linkDB = 'mongodb+srv://skywalker:DSadoiLV5aButT3X@cluster0.4396x.mongodb.net/cafe'

}

process.env.URL_DB = linkDB;

