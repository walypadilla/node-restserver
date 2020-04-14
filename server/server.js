require('./config/config');

const express = require('express');
const mongoose = require('mongoose');
const path = require('path');


const app = express();
const bodyParser = require('body-parser');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded( { extended: false } ));
 
// parse application/json
app.use( bodyParser.json() );

// habilitar la carpeta public
app.use( express.static( path.resolve(__dirname, '../public') ) );

// Configuracion global de rutas
app.use(require('./routes/index'));


app.listen(process.env.PORT, () => {
    console.log('Escuhando el puerto: ', process.env.PORT);
});


mongoose.connect(process.env.URLDB,
    {useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true}).
    then(
        () => { console.log('Base de Datos ONLINE'); },
        (err) => { throw new Error(err) }
)
        

   

