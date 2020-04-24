const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();

const Usuario = require('../models/usuario');
const Producto = require('../models/producto');

const fs = require('fs');
const path = require('path');

// default options
app.use(fileUpload( { useTemfiles: true }) );


app.put('/upload/:tipo/:id', (req, res) => {

    let tipo = req.params.tipo;
    let id = req.params.id;

    if(!req.files) {
        return res.status(400)
            .json({
                ok: false,
                err: {
                    message: 'No se ha seleccionado ningun archivo'
                }
            });
    }

    // obteniendo nombre del archivo y su extension
    let archivo = req.files.archivo;
    let nombreCortado = archivo.name.split('.');
    let extension = nombreCortado[ nombreCortado.length -1 ];

    // Extensiones permitidas
    let extensionesValidas = ['png', 'jpg', 'gif', 'jpeg'];

    if ( extensionesValidas.indexOf( extension ) < 0) {
        return res.status(400).json({
            ok: false, 
            err: {
                message: 'Las extensiones permitidas son ' + extensionesValidas.join(', '),
                ext: extension
            }
        });
    }

    // Valida tipo
    let tiposValidos = ['productos', 'usuarios'];
    if ( tiposValidos.indexOf( tipo ) < 0) {
        return res.status(400).json({
            ok: false, 
            err: {
                message: 'Los tipos permitidos son ' + tiposValidos.join(', ')
            }
        });
    }

    // Cambiar nombre al archivo
    // id imagen-milisegundos.extension
    let nombreArchivo = `${ id }-${ new Date().getMilliseconds() }.${ extension }`;

    archivo.mv(`uploads/${ tipo }/${ nombreArchivo }`, (err) => {

        if (err) {
          return res.status(500)
            .json({
              ok: false,
              err
            });
        }  

        // Aqui imagen cargada
        if( tipo === 'usuarios' ) {
            imagenUsuario(id, res, nombreArchivo);
        } else {
            imagenProducto(id, res, nombreArchivo);
        }
        
      });

});

// seleccionando imagen por usuario
function imagenUsuario(id, res, nombreArchivo) {

    Usuario.findById( id, (err, usuarioBD) => {

        if (err) {
            borraArchivo( nombreArchivo, 'productos');

            return res.status(500).json({
                ok: false, 
                err
            });
        }

        if ( !usuarioBD ) {
            borraArchivo( nombreArchivo, 'productos');

            return res.status(400).json({
                ok: false,
                err: {
                    messege: 'Producto no existe'
                }
            });
        }

        // Borrando imagen de usuario, cuando se actualiza
        borraArchivo( usuarioBD.img, 'productos');

        usuarioBD.img = nombreArchivo;

        usuarioBD.save( (err, usuarioGuardado) => {
            
            res.json({
                ok: true,
                usuario: usuarioGuardado,
                img: nombreArchivo
            });
        });

    });
}

// seleccionando imagen para productos
function imagenProducto(id, res, nombreArchivo) {

    Producto.findById( id, (err, productoBD) => {

        if (err) {
            borraArchivo( nombreArchivo, 'productos');

            return res.status(500).json({
                ok: false, 
                err
            });
        }

        if ( !productoBD ) {
            borraArchivo( nombreArchivo, 'productos');

            return res.status(400).json({
                ok: false,
                err: {
                    messege: 'Producto no existe'
                }
            });
        }

        // Borrando imagen de usuario, cuando se actualiza
        borraArchivo( productoBD.img, 'productos');

        productoBD.img = nombreArchivo;

        productoBD.save( (err, productoGuardado) => {
            
            res.json({
                ok: true,
                producto: productoGuardado,
                img: nombreArchivo
            });
        });

    });
}

// borrado de archivos
function borraArchivo( nombreImagen, tipo ) {

    // obteniendo ruta de la imagen
    let pathImagen = path.resolve(__dirname, `../../uploads/${ tipo }/${ nombreImagen }` );
    if ( fs.existsSync(pathImagen) ){
        fs.unlinkSync( pathImagen );
    }
}

module.exports = app;