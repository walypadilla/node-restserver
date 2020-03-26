require('./config/config');

const express = require('express');
const mongoose = require('mongoose');


const app = express();
const bodyParser = require('body-parser');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded( { extended: false } ));
 
// parse application/json
app.use( bodyParser.json() );

// import rutas de usuario
app.use( require('./routes/usuario') );


app.listen(process.env.PORT, () => {
    console.log('Escuhando el puerto: ', process.env.PORT);
});


mongoose.connect(process.env.URLDB,
    {useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true}).
    then(
        () => { console.log('Base de Datos ONLINE'); },
        (err) => { throw new Error(err) }
)
        

   

