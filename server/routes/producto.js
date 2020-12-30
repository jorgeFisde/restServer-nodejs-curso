const express = require('express');

const { verificaToken, verificaRolUsuario } = require('../middlewares/autorizacion');
const _ = require('underscore');

const app = express();
const Producto = require('../models/producto');
const Categoria = require('../models/categoria.model');



/**
 * 
 *          OBTENER PRODUCTO
 * 
 */

app.get('/productos', verificaToken, async (req, res) => {
    /**
     * trae todos los productos
     * populate de usuario y categoria
     * paginado
     */
    let desde = req.query.desde || 0;
    desde = Number(desde);
    let productos;


    try {

        productos = await Producto.find({})
            .skip(desde)
            .limit(5)
            .populate('usuario categoria', 'nombre email descripcion')
            .exec()

        if (!productos) {

            return res.json({
                ok: false,
                err: {
                    message: 'No se encontraron productos'
                }
            });

        }

    } catch (err) {

        return res.status(500).json({
            ok: false,
            err
        })

    }

    res.json({
        ok: true,
        productos
    });




});

/**
 * 
 *          OBTENER UN PRODUCTO POR ID
 * 
 */

app.get('/productos/:id', verificaToken, async (req, res) => {
    /**
     * populate de usuario y categoria
     * paginado
     */

    let id = req.params.id;
    let productos;

    try {

        productos = await Producto.findById(id)
            .populate('usuario categoria', 'nombre email descripcion')
            .exec()
        if (!productos) {

            return res.json({
                ok: false,
                err: {
                    message: 'No se encontraron productos'
                }
            });

        }

    } catch (err) {

        return res.json({
            ok: false,
            err
        })

    }

    res.json({
        ok: true,
        productos
    });


});

/**
 * 
 *       BUSCAR PRODUCTO CON EXPRECION REGULAR SUPER EFICIENTE EN MONGO
 * 
 */


app.get('/productos/buscar/:termino', verificaToken, async (req, res) => {

    let termino = req.params.termino;
    // exprecion regular con "termino" insencible a mayús y minús
    let regEx = new RegExp(termino, 'i');

    let producto;

    try {

        producto = await Producto.find({ nombre: regEx })
            .populate('categoria', 'descripcion')
            .exec()
        if (!producto) {

            return res.status(400).json({
                ok: false,
                err: {
                    message: 'No se encontraron coincidencias'
                }
            });

        }

    } catch (error) {

        return res.status(500).json({
            ok: false,
            error
        });

    }

    res.json({
        ok: true,
        producto
    });

})



/**
 * 
 *          CREAR PRODUCTO
 * 
 */

app.post('/productos', verificaToken, async (req, res) => {
    /**
     * Grabar usuario y categoria
     * populate de usuario y categoria
     */
    let miProducto;
    let body = req.body;
    let idUsuario = req.usuario._id;
    let idCategoria = await obtenerIdCat(body.categoria);

    if (!idCategoria.ok) {
        return res.json({
            ok: false,
            err: idCategoria.err
        })
    }

    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: true,
        categoria: idCategoria.id,
        usuario: idUsuario
    });

    try {

        miProducto = await producto.save()

    } catch (err) {

        return res.json({
            ok: false,
            err
        })

    }

    res.json({
        ok: true,
        producto: miProducto
    });


});

/**
 * 
 *          ACTUALIZAR PRODUCTO
 * 
 */

app.put('/productos/:id', verificaToken, async (req, res) => {
    /**
     *  actualizar prouducto
     */

    let body = req.body;
    let id = req.params.id;

    console.log(id);

    let update = _.pick(body, ['nombre', 'precioUni', 'descripcion', 'disponible'])
    let options = { new: true };

    let producto

    try {

        producto = await Producto.findOneAndUpdate({ _id: id }, update, options)

    } catch (err) {

        return res.status(400).json({
            ok: false,
            msg: 'ID desconocido',
            err
        });

    }

    res.json({
        ok: true,
        producto
    });


});

/**
 * 
 *          BORRAR PRODUCTO
 * 
 */

app.delete('/productos/:id', verificaToken, verificaRolUsuario, async (req, res) => {
    /**
     * actualizar el estado de un producto
     */


    let id = req.params.id;

    let producto;

    let update = {
        disponible: false
    };

    let options = { new: true };

    try {

        producto = await Producto.findOneAndUpdate({ _id: id }, update, options)

        if (!producto) {
            return res.json({
                ok: false,
                err: {
                    message: `No se encontraron coincidencias con - ${id}`
                }
            });
        }

    } catch (err) {
        return res.status(400).json({
            ok: false,
            err
        });
    }

    res.json({
        ok: true,
        producto
    });

});





const obtenerIdCat = async (name) => {

    let categoria;
    try {

        categoria = await Categoria.findOne({ descripcion: name })
            .exec()
        if (!categoria) {
            return {
                ok: false,
                err: {
                    message: `No se encontró ninguna categoria con el nombre=${name}`
                }
            }
        }
    } catch (error) {

        return {
            ok: false,
            err: error
        }
    }



    return {
        ok: true,
        id: categoria._id
    }


}



module.exports = app;
