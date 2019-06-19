require('./config/config');

const express = require('express');
const app = express();

var bodyParser = require('body-parser');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.get('/pedo', function(req, res) {
    res.json('get caca')
});
app.post('/pedo', function(req, res) {

    let body = req.body;

    if (body.nombre === undefined) {
        res.status(400).json({
            ok: false,
            mensaje: 'Valio vergamo'
        })
    } else {
        res.json({
            body
        });
    }


});
app.put('/pedo:id', function(req, res) {

    let id = req.params.id;

    res.json({
        id
    })
});

app.listen(process.env.PORT, () => {
    console.log('Escochando puesto:', process.env.PORT);
});