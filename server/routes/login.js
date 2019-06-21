const express = require('express');
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');

const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);

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

//Configuraciones de Google
async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID, // Specify the CLIENT_ID of the
        //app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();

    return {
        nombre: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    }
}

app.post('/google', async(req, res) => {

    let token = req.body.idtoken;

    let googleUser = await verify(token).catch(e => {
        return res.status(403).json({
            ok: false,
            err: e
        });
    });

    Caca.findOne({ email: googleUser.email }, (err, cacaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Valio vergamo',
                err
            });
        }

        if (cacaDB) {
            if (cacaDB.google === false) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Debe de usar su autenticacion normal',
                    err
                });
            } else {
                let token = jwt.sign({
                    caca: cacaDB
                }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });


                return res.json({
                    ok: true,
                    caca: cacaDB,
                    token
                })
            }
        } else {
            //Si el usuario no existe en nuestra BD
            let caca = new Caca();

            caca.nombre = googleUser.nombre;
            caca.email = googleUser.email;
            caca.img = googleUser.img;
            caca.google = true;
            caca.password = ':v';

            caca.save((err, cacaDB) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Valio vergamo',
                        err
                    });
                };
                let token = jwt.sign({
                    caca: cacaDB
                }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });


                return res.json({
                    ok: true,
                    caca: cacaDB,
                    token
                })
            })
        }

    });
});



module.exports = app;