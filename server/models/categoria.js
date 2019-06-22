const mongoose = require('mongoose');
//const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

let categoriaSchema = new Schema({
    descripcion: { required: true, type: String, unique: true },
    caca: { type: Schema.Types.ObjectId, ref: 'Caca' }
});

//categoriaSchema.plugin(uniqueValidator, { message: '{PATH} debe de ser unico' });

module.exports = mongoose.model('Categoria', categoriaSchema);