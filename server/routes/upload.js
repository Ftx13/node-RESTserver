//Express
const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();
//Node
const fs = require('fs');
const path = require('path');
//Model
const Caca = require('../models/caca');
const Producto = require('../models/producto');

// default options
app.use(fileUpload({ useTempFiles: true }));

app.put('/upload/:tipo/:id', (req, res) => {

    let tipo = req.params.tipo;
    let id = req.params.id;

    if (req.file == false) {
        return res.status(400).json({
            ok: false,
            err: {
                messege: 'No haz seleccionada un archivo',
            }
        })
    }
    //Validar tipos
    let tiposValidos = ['producto', 'caca'];
    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                messege: 'Los tipos permitidos son: ' + tiposValidos.join(',')
            }
        })
    }

    let file = req.files.file;
    let nombreSplitHalf = file.name.split('.')
    let extensiones = nombreSplitHalf[nombreSplitHalf.length - 1];

    //Extensiones 
    let extensionesValidas = ['jpeg', 'jpg', 'gif', 'gif'];

    if (extensionesValidas.indexOf(extensiones) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                messege: 'Las extensiones permitidas son ' + extensionesValidas,
                ext: extensiones
            }
        })
    }
    //cambiar nombre del archivo img
    let nombreArchivo = `${id} + ${new Date().getMilliseconds()}.${extensiones}`;


    file.mv(`upload/${ tipo }/${ nombreArchivo }`, (err) => {
        if (err)
            return res.status(500).json({
                ok: false,
                err
            });

        //aqui, imagen cargada
        if (tipo === 'caca') {
            imagenCaca(id, res, nombreArchivo);
        } else {
            imagenProducto(id, res, nombreArchivo);
        }
    });

});

function imagenProducto(id, res, nombreArchivo) {

    Producto.findById(id, (err, productoDB) => {
        if (err) {
            borrarArchivo(nombreArchivo, 'producto');
            return res.status(500).json({
                ok: false,
                err
            })
        }
        if (!productoDB) {
            borrarArchivo(nombreArchivo, 'producto');
            return res.status(400).json({
                ok: false,
                err: {
                    messege: 'No existen productos',
                    err
                }
            });
        }

        borrarArchivo(productoDB.img, 'producto')

        productoDB.img = nombreArchivo;

        productoDB.save((err, productoSave) => {
            res.json({
                ok: true,
                producto: productoSave,
                img: nombreArchivo
            });
        });
    });
}

function imagenCaca(id, res, nombreArchivo) {

    Caca.findById(id, (err, cacaDB) => {
        if (err) {
            borrarArchivo(nombreArchivo, 'caca');
            return res.status(500).json({
                ok: false,
                err
            })
        }
        if (!cacaDB) {
            borrarArchivo(nombreArchivo, 'caca');
            return res.status(400).json({
                ok: false,
                err: {
                    messege: 'La caca no es, nunca mas'
                }
            });
        }

        borrarArchivo(cacaDB.img, 'caca');

        cacaDB.img = nombreArchivo;

        cacaDB.save((err, cacaSave) => {
            res.json({
                ok: true,
                caca: cacaSave,
                img: nombreArchivo
            });
        });
    });
};

function borrarArchivo(nombreImagen, tipo) {
    //antes de borra debe de existit el PAth de la imagen
    let pathImagen = path.resolve(__dirname, `../../upload/${tipo}/${nombreImagen}`);

    if (fs.existsSync(pathImagen)) {
        fs.unlinkSync(pathImagen); //borrar imagen con el path
    }
};
module.exports = app;