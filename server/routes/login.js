const express = require('express');
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');

const Caca = require('../models/caca');

const app = express();

app.post('/login', (req, res) => {

    let body = req.body;

    Caca.findOne({ email: body.email }, (err, cacaDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Valio vergamo',
                err
            });
        }

        if (!cacaDB) {
            return res.status(400).json({
                ok: false,
                mensaje: '(user) y pass incorrectos'
            });
        }

        if (!bcrypt.compareSync(body.password, cacaDB.password)) {
            return res.status(500).json({
                ok: false,
                mensaje: 'user y (pass) incorrectos'
            });
        }

        let token = jwt.sign({
            caca: cacaDB
        }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });

        res.json({
            ok: true,
            caca: cacaDB,
            token
        });
    });
});




module.exports = app;