const Usuario = require('../models/usuario');

const express = require('express');
const bcrypt = require('bcrypt');
const _ = require('underscore');

const app = express();


app.get('/usuario', (req, res) => {

    let desde = Number(req.query.desde) || 0;
    let limite = Number(req.query.limite) || 5;

    //  OBTENER DATOS DE LA BD POR PAGINACION 
    Usuario.find({ estado: true })
        .skip(desde)
        .limit(limite)
        .exec((err, usuario) => {
            if (err) {
                throw res.json({
                    ok: false,
                    err
                })
            }
            Usuario.count({ estado: true }, (err, conteo) => {
                res.json({
                    ok: true,
                    total: conteo,
                    usuario
                })
            })
             

        })

})

app.post('/usuario', async (req, res) => {

    let body = req.body;

    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });

    await usuario.save()
        .then(usuarioDB => {
            res.status(200).json({
                ok: true,
                usuario: usuarioDB
            });
        })
        .catch(err => {
            throw res.json({
                ok: false,
                err
            })
        })



})

app.put('/usuario/:id', (req, res) => {

    let id = req.params.id;
    // FUNCION PICK DE UNDERSCORE QUE REGRESA UN OBJETO SOLO CON LO QUE YO LE PIDO EN EL ARREGLO DE LLAVES
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);

    Usuario.findByIdAndUpdate(id, body, { new: true }, (err, usuarioDB) => {

        if (err) {
            throw res.json({
                ok: false,
                err
            })
        }

        res.status(200).json({
            ok: true,
            usuario: usuarioDB
        });

    })

})


app.delete('/usuario/:id', (req, res) => {

    let id = req.params.id;
    // FUNCION PICK DE UNDERSCORE QUE REGRESA UN OBJETO SOLO CON LO QUE YO LE PIDO EN EL ARREGLO DE LLAVES
    let cambiarEstado = {
        estado: false
    }

    Usuario.findByIdAndUpdate(id, cambiarEstado, { new: true }, (err, usuarioDB) => {

        if (err) {
            throw res.json({
                ok: false,
                err
            })
        }

        res.status(200).json({
            ok: true,
            usuario: usuarioDB
        });

    })

})


module.exports = app;