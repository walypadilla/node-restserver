
const express = require('express');

const { verificaToken } = require('../middlewares/autenticacion');

let app = express();
let Producto = require('../models/producto');

// =====================================
// Obtener productos
// =====================================
app.get('/productos', verificaToken, (req, res) => {
    // trae todos los productos
    //populate: usuario y categoria
    //Paginado
    // Solicitando el numero desde cuanto comienza a aparecer
    let desde = req.query.desde || 0;
    desde = Number(desde);

    // Solicitando el limite hasta donde mostrar
    let limite = req.query.limite || 5;
    limite = Number(limite);

    Producto.find({ disponible: true })
            .skip(desde)
            .limit(limite)
            .sort('producto')
            .populate('usuario', 'nombre email')
            .populate('categoria', 'descripcion')
            .exec( (err, productos) => {

                if (err) {
                    return res.status(500).json({
                        ok: false,
                        err
                    });
                }

                Producto.count( { disponible: true }, (err, conteo) => {
                    res.json({
                        productos,
                        cantidad: conteo
                    });
                });

            });

});

// =====================================
// Obtener producto por ID
// =====================================
app.get('/productos/:id', verificaToken, (req, res) => {
    //populate: usuario y categoria
    let id = req.params.id;

    Producto.findById( id )
            .populate('usuario', 'nombre email')
            .populate('categoria', 'descripcion')
            .exec( (err, productoBD) => {

                if (err) {
                    return res.status(500).json({
                        ok: false,
                        err
                    });
                }

                if ( !productoBD ) {
                    return res.status(400).json({
                        ok: false,
                        err: {
                            message: 'El ID no existe'
                        }
                    });
                }

                res.json({
                    ok: true,
                    producto: productoBD
                });

    });

});

// =====================================
// Obtener producto por ID
// =====================================
app.get('/productos/buscar/:termino', verificaToken, (req, res) => {

    let termino = req.params.termino;

    let regex = new RegExp(termino, 'i');

    Producto.find({ nombre: regex, disponible: true })
            .populate('categoria', 'nombre')
            .exec( (err, productos) => {

                if (err) {
                    return res.status(500).json({
                        ok: false,
                        err
                    });
                }

                if ( !productos ) {
                    return res.status(400).json({
                        ok: false,
                        err: {
                            message: 'El producto no existe'
                        }
                    });
                }

                res.json({
                    ok: true,
                    productos
                });

            });
})

// =====================================
// crea un nuevo producto
// =====================================
app.post('/productos', verificaToken, (req, res) => {
    // grabar el usuario
    // grabar una categoria del listado
    let body = req.body;

    let producto = new Producto({
        usuario: req.usuario._id,
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria
    });

    producto.save( (err, productoBD) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        res.status(201).json({
            ok: true,
            producto: productoBD
        });
    });
});

// =====================================
// Actualizar un nuevo producto
// =====================================
app.put('/productos/:id', verificaToken, (req, res) => {
    // grabar el usuario
    // grabar una categoria del listado
    let id = req.params.id;
    let body = req.body;

    // verificamos si existe el id para actualizar
    Producto.findById( id, (err, productoBD) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if ( !productoBD ) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El ID no existe'
                }
            });
        }

        productoBD.nombre = body.nombre;
        productoBD.precioUni = body.precioUni;
        productoBD.descripcion = body.descripcion;
        productoBD.disponible = body.disponible;
        productoBD.categoria = body.categoria;
        
        productoBD.save( (err, productoGuardado) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                producto: productoGuardado
            });
        });

    });


});

// =====================================
// Borrar un producto
// =====================================
app.delete('/productos/:id', verificaToken, (req, res) => {
    // grabar el usuario
    // grabar una categoria del listado
    let id = req.params.id;

    Producto.findById( id, (err, productoBD) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if ( !productoBD ) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Producto no encontrado'
                }
            });
        }

        productoBD.disponible = false;

        productoBD.save( (err, productoBorrado) => {
            
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                producto: productoBorrado,
                message: 'Producto Borrado'
            });

        });

    });

});


module.exports = app;