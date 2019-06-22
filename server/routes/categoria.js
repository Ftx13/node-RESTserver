const express = require('express');
const { verificarToken, verificaAdminRole } = require('../middlewares/tokens')
const app = express();

const Categoria = require('../models/categoria');

//////////////////////////////
//Mostrar todas las categorias
app.get('/categoria', verificarToken, (req, res) => {

    Categoria.find({})
        .sort('descripcion')
        .populate('caca', 'nombre email')
        //.populate('caca', 'nombre email') --- por si quieres mas
        .exec((err, categorias) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                categorias
            })
        });

});
//////////////////////////////
//Mostrar una categoria por Id
app.get('/categoria/:id', verificarToken, (req, res) => {

    let id = req.params.id

    Categoria.findById(id, (err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al guardar la categoria',
                err
            });
        }
        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No se creo la categoria',
                err
            });
        }
        res.json({
            ok: true,
            categoria: categoriaDB
        });
    });
});
/////////////////
//Crear categoria
app.post('/categoria', verificarToken, (req, res) => {
    let body = req.body;

    let categoria = new Categoria({
        descripcion: body.descripcion,
        caca: req.caca
    })
    categoria.save((err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al guardar la categoria',
                err
            });
        }
        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No se creo la categoria',
                err
            });
        }
        res.json({
            ok: true,
            categoria: categoriaDB
        });

    });
});
/////////////////
//PUT 
app.put('/categoria/:id', (req, res) => {
    let id = req.params.id;
    let body = req.body;

    let descCategoria = {
        descripcion: body.descripcion
    };

    Categoria.findByIdAndUpdate(id, descCategoria, { new: true, runValidators: true }, (err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al guardar la categoria',
                err
            });
        }
        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No se creo la categoria',
                err
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });
    });
});
/////////////////
//DELETE
app.delete('/categoria/:id', [verificarToken, verificaAdminRole], (req, res) => {
    let id = req.params.id;

    Categoria.findByIdAndRemove(id, (err, categoriaDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El Id no existetete.'
                }
            });
        }

        res.json({
            ok: true,
            message: 'categoria borrada'
        });


    });
});


module.exports = app;