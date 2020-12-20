// archivo de configuracion global 
require('./config/config');
const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())


// IMPORTACION DE RUTAS
app.use(require('./routes/usuario'));

mongoose.connect( process.env.URL_DB ,
    { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true },
    (err, res) => {

        if (err) throw new Error(`Ha ocurrido un error: ${err}`);

        console.log(`Base de datos ONLINE`);

    });




app.listen(process.env.PORT, () => {
    console.log('Estoy en el puerto', process.env.PORT);
})

