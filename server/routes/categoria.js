const express = require('express');

const { verificaToken, verificaRolUsuario } = require('../middlewares/autorizacion');
const Categoria = require('../models/categoria.model');


const app = express();




/**
 *      OBTENER TODAS LAS CATEGORIAS
 */

app.get('/categorias', verificaToken, (req, res) => {


    Categoria.find({})
        .populate('usuario', 'nomrbe email')
        .sort('descripcion')
        .exec((err, categoriaDB) => {
            if (err) {
                throw res.json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                categoria: categoriaDB
            });
        })



});

/**
 *      OBTENER TODAS LAS CATEGORIAS
 */

app.get('/categorias/:id', verificaToken, (req, res) => {

    let id = req.params.id

    Categoria.findById(id, (err, categoriaDB) => {

        if (err) {
            return res.json({
                ok: false,
                err
            });
        }

        if (!categoriaDB) {

            return res.status(400).json({
                ok: false,
                err: {
                    message: 'No se encontraron coincidencias'
                }
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });

    })



});



/**
 *      OBTENER CATEGORIA POR ID's Y ACTUALIZARLA
 */

app.put('/categorias/:id', verificaToken, (req, res) => {

    let id = req.params.id
    let body = req.body;

    let descCategoria = {
        descripcion: body.descripcion
    }


    Categoria.findByIdAndUpdate(id, descCategoria, { new: true }, (err, categoriaDB) => {

        if (err) {
            return res.json({
                ok: false,
                err
            });
        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                error: {
                    message: `No existe la categoria con el id: ${id}`
                }
            })
        }


        res.json({
            ok: true,
            categoria: categoriaDB
        });

    })


});

/**
 *      CREAR CATEGORIAS
 */

app.post('/categorias', verificaToken, async (req, res) => {

    let body = req.body;
    let newCat;

    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id
    });



    try {
        newCat = await categoria.save()
    } catch (error) {
        return res.json({
            ok: false,
            error
        })
    }



    res.json({
        ok: true,
        categoria: newCat
    });


});


/**
 *      ELIMINAR CATEGORIA
 */

app.delete('/categorias/:id', [verificaToken, verificaRolUsuario], (req, res) => {

    let id = req.params.id;

    Categoria.findOneAndDelete(id, (err, categoriaDB) => {


        if (err) {
            return res.json({
                ok: false,
                err
            });
        }

        if (!categoriaDB) {
            res.status(400).json({
                ok: false,
                error: {
                    message: `No existe la categoria con el id: ${id}`
                }
            })
        }


        res.json({
            ok: true,
            categoria: categoriaDB
        });




    })


});





module.exports = app;


