const express = require('express');
const fileUplioad = require('express-fileupload');
const fs = require('fs');
const path = require('path');

const { verificaToken } = require('../middlewares/autorizacion');
const { resError } = require('../middlewares/errorMessage');
const Usuario = require('../models/usuario');
const Producto = require('../models/producto');

const app = express();


// OPTIONS FOR FILE-UPLOAD
app.use(fileUplioad({
    useTempFiles: true
}));


app.put('/upload/:tipo/:id', verificaToken, async (req, res) => {


    let tipo = req.params.tipo;
    let id = req.params.id;

    let tiposPermitidos = ['usuarios', 'productos'];

    if (tiposPermitidos.indexOf(tipo) < 0) {

        return res.status(400).json({
            ok: false,
            err: {
                tipo,
                message: `Tipo no válido, los tipos validos son ${tiposPermitidos.join(', ')}`
            }
        });

    }


    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'No se seleccionó ningún archivo'
            }
        });
    }

    let archivo = req.files.archivo;
    let nombreArchivoCortado = archivo.name.split('.');
    let extension = nombreArchivoCortado[nombreArchivoCortado.length - 1];

    let extPermitidas = ['png', 'jpg', 'jpeg', 'gif'];

    if (extPermitidas.indexOf(extension) < 0) {

        return res.status(400).json({
            ok: false,
            err: {
                extension,
                message: `Extension no válida, las extenciones permitidas son ${extPermitidas.join(', ')}`
            }
        })

    }

    // cambiamos nombre del archivo para evitar coincidencias
    let nuevoNombre = `${id}-${new Date().getMilliseconds()}.${extension}`

    try {

        await archivo.mv(`uploads/${tipo}/${nuevoNombre}`);

        switch (tipo) {
            case 'usuarios':
                try {
                    await imagenUsuario(id, res, nuevoNombre);
                } catch (error) {
                    return resError(error, 500, res);
                }


                break;

            case 'productos':

                try {
                    await imagenProducto(id, res, nuevoNombre);
                } catch (error) {
                    return resError(error, 500, res);
                }



                break;
        }


    } catch (error) {

        return resError(error, 500, res);
        // return res.status(500).json({
        //     ok: false,
        //     error
        // });

    }





});


const imagenUsuario = async (id, res, nombreArchivo) => {

    let usuario;

    try {

        usuario = await Usuario.findById(id).exec()

    } catch (err) {

        borrarImg(nombreArchivo, 'usuarios');

        return resError(err, 500, res);

    }

    if (!usuario) {

        borrarImg(nombreArchivo, 'usuarios');

        return res.status(400).json({
            ok: false,
            err: {
                message: `El usuario con el id=${id} no existe`
            }
        })

    }

    borrarImg(usuario.img, 'usuarios');

    usuario.img = nombreArchivo;

    try {

        await usuario.save();

    } catch (err) {

        return resError(err, 500, res);

    }

    return res.json({
        ok: true,
        usuario
    })


}


const imagenProducto = async (id, res, nombreArchivo) => {

    let productoDB;

    try {

        productoDB = await Producto.findById(id).exec();

    } catch (err) {
        borrarImg(nombreArchivo, 'productos');
        return resError(err, 500, res);

    }

    if (!productoDB) {

        borrarImg(nombreArchivo, 'productos');

        return res.status(401).json({
            ok: false,
            err: {
                message: `El producto con el id=${id} no existe`
            }
        })

    }

    borrarImg(productoDB.img, 'productos');

    productoDB.img = nombreArchivo;

    try {

        await productoDB.save();

        res.json({
            ok: true,
            producto: productoDB
        })

    } catch (err) {

        return resError(err, 500, res);

    }



}


const borrarImg = (nombreImg, tipo) => {

    let imgPath = path.resolve(__dirname, `../../uploads/${tipo}/${nombreImg}`);

    if (fs.existsSync(imgPath)) {

        fs.unlinkSync(imgPath);

    }

}



module.exports = app;
