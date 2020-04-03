const express = require('express');

const app = express();

// importando rutas 
app.use( require('./usuario') );
app.use( require('./login') );


module.exports = app;