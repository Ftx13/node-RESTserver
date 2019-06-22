const express = require('express');
const { verificarToken } = require('../middlewares/tokens');

let app = express();


let Producto = require('../models/producto');

//Obtener productos//
/////////////////////
app.get('/producto', verificarToken, (req, res) => {

        let desde = req.query.desde || 0;
        desde = Number(desde);

        Producto.find({ disponible: true })
            .skip(desde)
            .limit(3)
            .populate('categoria', 'descripcion')
            .populate('caca', 'nombre email')
            .exec((err, productos) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        err
                    });
                }
                res.json({
                    ok: true,
                    productos
                });
            })
    })
    //Obtener productos por id//
    ////////////////////////////
app.get('/producto/:id', verificarToken, (req, res) => {
    let id = req.params.id;

    Producto.findById(id)
        .populate('caca', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            if (!productos) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                productos
            });
        })
});
//Buscar por producto//
////////////////////////////
app.get('/producto/buscar/:termino', verificarToken, (req, res) => {
    let termino = req.params.termino

    let regex = new RegExp(termino, 'i');

    Producto.find({ nombre: regex })
        .populate('categoria', 'descripcion')
        .exec((err, producto) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            if (!producto) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                producto
            });
        })
})


//Crear un producto//
/////////////////////
app.post('/producto', verificarToken, (req, res) => {
    let body = req.body;

    let producto = new Producto({
        caca: req.caca._id,
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria
    })
    producto.save((err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err: {
                    messege: 'Error al guardar el producto',
                }
            });
        }
        res.status(201).json({
            ok: true,
            producto: productoDB
        })
    });
});
//Actualizar productos//
////////////////////////
app.put('/producto/:id', verificarToken, (req, res) => {
    let id = req.params.id;
    let body = req.body;

    Producto.findById(id, (err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al guardar el producto',
                err
            });
        }
        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No se creo el producto',
                err
            });
        }

        productoDB.nombre = body.nombre;
        productoDB.precioUni = body.precioUni;
        productoDB.descripcion = body.descripcion;
        productoDB.disponible = body.disponible;
        productoDB.categoria = body.categoria;

        productoDB.save((err, productoSave) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                producto: productoSave
            });
        });
    });
});
//Borrar//
////////////////////////
app.delete('/producto/:id', verificarToken, (req, res) => {
    let id = req.params.id;

    Producto.findByIdAndUpdate(id, { disponible: false }, { new: true, runValidators: true }, (err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al guardar el producto',
                err
            });
        }
        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No se creo el producto',
                err
            });
        }
        res.json({
            ok: true,
            producto: productoDB,
            messege: 'Producto borrado'
        });
    });
});

module.exports = app