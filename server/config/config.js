//PUERTO
process.env.PORT = process.env.PORT || 3000;

//ENTORNO
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//BD
let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/coca';
} else {
    urlDB = 'mongodb+srv://ftx13:l2ykJHC1og9xVA2y@cluster0-msa3r.mongodb.net/Coca'
}
process.env.URLDB = urlDB;