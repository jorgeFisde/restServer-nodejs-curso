const Usuario = require('../models/usuario');
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);


const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const usuario = require('../models/usuario');


const app = express();


app.post('/login', (req, res) => {

    let body = req.body;

    Usuario.findOne({ email: body.email }, (err, usuarioDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!usuarioDB) {

            return res.status(400).json({
                ok: false,
                err: {
                    message: '(Usuario) o  contraseña incorrectos'
                }
            });

        }

        if (!bcrypt.compareSync(body.password, usuarioDB.password)) {

            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario o  (contraseña) incorrectos'
                }
            });

        }

        let token = jwt.sign({
            usuario: usuarioDB
        }, process.env.SEED, { expiresIn: 60 * 60 * 24 * 30 })

        res.status(200).send({
            ok: true,
            usuario: usuarioDB,
            token
        })

    })


})


//  Configuraciones de Google

async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();

    console.log(payload.name);
    console.log(payload.email);
    console.log(payload.picture);

    return {
        nombre: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    }

}




app.post('/google', async (req, res) => {

    let body = req.body;

    let usuarioGoogle = await verify(body.idtoken)
        .catch(err => {
            throw res.status(401).json({
                ok: false,
                err
            });
        });


    Usuario.findOne({ email: usuarioGoogle.email }, async (err, usuarioDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (usuarioDB) {

            if (!usuarioDB.google) {

                return res.json({
                    ok: false,
                    error: {
                        message: 'Debes de iniciar sesion con tu cuenta normal'
                    }
                });

            }

            let token = jwt.sign({
                usuario: usuarioDB
            }, process.env.SEED, { expiresIn: 60 * 60 * 24 * 30 })

            return res.json({
                ok: true,
                token,
                usuario: usuarioDB
            })

        } else {

            let usuario = new Usuario();

            usuario.nombre = usuarioGoogle.nombre;
            usuario.email = usuarioGoogle.email;
            usuario.img = usuarioGoogle.picture;
            usuario.google = true;
            usuario.password = ':O';

            let user = await usuario.save()
                .catch(e => {
                    return res.status(500).json({
                        ok: false,
                        e
                    })
                })
            let token = jwt.sign({
                user
            }, process.env.SEED, { expiresIn: 60 * 60 * 24 * 30 })

            console.log('creado en bd');

            return res.json({
                ok: true,
                token,
                usuario
            })

        }

    });


})



module.exports = app;