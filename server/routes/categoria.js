
const express = require('express');

let { verificaToken, verificaAdmin_Role } = require('../middlewares/autenticacion');

let app = express();

let Categoria = require('../models/categoria');


//==================================
//Mostrar todas las categorias
//==================================
app.get('/categoria', (req, res) => {

    // // solicitando el numero desde cuanto comienza a aparecer
    let desde = req.query.desde || 0;
    desde = Number(desde);

    // solicitando el limite de registros a mostrar
    let limite = req.query.limite || 5;
    limite = Number(limite);

    Categoria.find({})
             .skip(desde)
             .limit(limite)
             .sort('descripcion') // orden en que quiero hacer el get
             .populate('usuario', 'nombre email') // Me permite mostrar datos del usuario
             .exec( (err, categorias) => {

                if (err) {
                    return res.status(500).json({
                        ok: false,
                        err
                    });
                }

                //mostrando cantidad de Categorias
                Categoria.count( (err, conteo) => {
                    res.json({
                        ok: true,
                        categorias,
                        cantidad: conteo
                    });
                });
             });

});

//==================================
//Mostrar una categoria por ID
//==================================
app.get('/categoria/:id', verificaToken, (req, res) => {
    //Categoria.findById()

    let id = req.params.id;

    Categoria.findById( id, (err, categoriaBD) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if ( !categoriaBD ) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El ID no es correcto'
                }
            });
        }

        res.json({
            ok: true, 
            categoria: categoriaBD
        })
    });

});

//==================================
//Crear nueva categoria
//==================================
app.post('/categoria', verificaToken, (req, res) => {
    //regresa la nueva categoria
    let body = req.body;
    
    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id
    });

    categoria.save( (err, categoriaBD) => {

        if (err) {
            return res.status(500).json({
                ok: false, 
                err
            });
        }

        res.status(201).json({
            ok: true, 
            categoria: categoriaBD
        });
    });

});

//==================================
//Actualiza la categoria categoria
//==================================
app.put('/categoria/:id', verificaToken, (req, res) => {
    
    let id = req.params.id;
    let body = req.body;

    let desCategoria = {
        descripcion: body.descripcion
    }

    Categoria.findByIdAndUpdate( id, desCategoria, { new: true, runValidators: true }, (err, categoriaBD) => {

        if (err) {
            return res.status(500).json({
                ok: false, 
                err
            });
        }

        if ( !categoriaBD ) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categoria: categoriaBD
        });

    });

});

//==================================
//Borrado de categoria
//==================================
app.delete('/categoria/:id', [verificaToken, verificaAdmin_Role], (req, res) => {
    //solo un administrador puede borrar categorias
    //Categoria.findByIdAndRemove 
    let id = req.params.id;

    Categoria.findByIdAndRemove( id, (err, categoriaBorrada) => {

        if ( err ) {
            return res.status(500).json({
                ok: false,
                err
            });
        };

        if ( !categoriaBorrada ) {
            return res.status(400).json({
                ok: false,
                err:{
                    message: 'El ID no existe'
                }
            });
        };

        res.json({
            ok: true, 
            message: 'Categoria Borrada'
        });

    });

});



module.exports = app;