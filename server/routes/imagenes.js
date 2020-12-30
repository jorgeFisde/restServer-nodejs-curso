const express = require('express');
const path    = require('path');
const fs      = require('fs');

const { verifyTokenUrl } = require('../middlewares/autorizacion');

const app = express();





app.get( '/imagen/:tipo/:img/?token', verifyTokenUrl, ( req, res ) => {

    let tipo = req.params.tipo;
    let img  = req.params.img;

    let imgPath = path.resolve( __dirname, `../../uploads/${tipo}/${img}` );

    if ( fs.existsSync( imgPath ) ) {
        
        res.sendFile( imgPath );

    }else{
        
        let noImgPath = path.resolve( __dirname, `../assets/no-image.jpg` );

        res.sendFile( noImgPath );

    }



})



