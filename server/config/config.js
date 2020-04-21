

//======================================
//Puerto
//======================================
process.env.PORT = process.env.PORT || 3000;


//======================================
//Entorno
//======================================

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//======================================
//Vencimiento del token
//======================================
// 60 segundos
// 60 minutos
// 24 horas
// 30 dias
process.env.CADUCIDAD_TOKEN = '72h';


//======================================
//SEED de autenticación
//======================================
process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo';

//======================================
// Base de datos
//======================================

let urlDB;

if ( process.env.NODE_ENV === 'dev' ) {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = process.env.MONGO_URI;
}

process.env.URLDB = urlDB;

//======================================
// Google Client ID
//======================================

process.env.CLIENT_ID = process.env.CLIENT_ID || '810554746084-jrlmu6irak084m7pmuk9g2b7c1ae6b92.apps.googleusercontent.com';4

