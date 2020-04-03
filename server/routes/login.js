const express = require('express');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const Usuario = require('../models/usuario');

const app = express();

// funcion post
app.post('/login', (req, res) => {
    
    let body = req.body;

    Usuario.findOne({ email : body.email }, (err, usuarioDB) =>{

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        //evaluando si no encuentra usuario
        if ( !usuarioDB ) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: '(Usuario) o contraseña incorrectos'
                }
            });
        }

        // comparando contraseña que envia usuario con la que esta en la base de datos, se usa una funcion de bcrypt
        if ( !bcrypt.compareSync( body.password, usuarioDB.password) ){
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario o (contraseña) incorrectos'
                }
            });
        }

        // generando token
        let token = jwt.sign({
            usuario: usuarioDB
        }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN })

        res.json({
            ok: true,
            usurio: usuarioDB,
            token
        });

    });

}) // end post()


module.exports = app;