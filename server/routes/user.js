const express = require('express');
const bcrypt = require('bcrypt');
const _ = require('underscore');

const Caca = require('../models/caca');

const app = express();

app.get('/pedo', function(req, res) {

    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);

    Caca.find({ estado: true }, 'nombre email role estado google img')
        .skip(desde)
        .limit(limite)
        .exec((err, usuario) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Valio vergamo',
                    err
                });
            }

            Caca.count({ estado: true }, (err, conteo) => {

                res.json({
                    ok: true,
                    message: 'Get Caca Local',
                    usuario,
                    cuentos: conteo
                })
            });
        });
});

app.post('/pedo', function(req, res) {

    let body = req.body;

    let caca = new Caca({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });

    caca.save((err, cacaDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Valio vergamo',
                err
            });
        }

        res.json({
            ok: true,
            caca: cacaDB
        });

    });

});
app.put('/pedo/:id', function(req, res) {

    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);


    Caca.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, cacaDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Valio vergamo',
                err
            });
        }
        res.json({
            ok: true,
            caca: cacaDB
        })
    });
});

app.delete('/pedo/:id', function(req, res) {

    let id = req.params.id;

    //    Caca.findByIdAndRemove(id, (err, bajarPalanca) => {

    let cambioEstado = {
        estado: false
    }

    Caca.findByIdAndUpdate(id, cambioEstado, { new: true }, (err, bajarPalanca) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Valio vergamo',
                err
            });
        }
        if (!bajarPalanca) {
            return res.status(400).json({
                ok: false,
                err: {
                    mensaje: 'Caca no encontrada'
                }
            });
        }

        res.json({
            ok: true,
            message: 'Le bajaste a a Palanca',
            caca: bajarPalanca
        });


    });
});

module.exports = app;