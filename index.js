// const express = require('express');  CommonJS modules
/* 
Para abilitar los ECMAScript modules debes ir al package.json
y añadir "type": "module"
*/
import express from 'express';
import csurf from 'csurf';
import cookieParser from 'cookie-parser';
import userRoutes from './routes/userRoutes.js';
import propertiesRoutes from './routes/propertiesRoutes.js';
import appRoutes from './routes/appRoutes.js';
import apiRoutes from './routes/apiRoutes.js';
import db from './config/db.js';

// Crear la app, el nombre puede variar (servidor, aplicación, proyecto)
// pero al final es solo una variable que contiene toda la información
// del servidor de express que se está creando
const app = express();

// Enabling reading of form's data(input type text, select, textarea, password, email, etc)
// but can't read uploaded files
app.use(express.urlencoded({ extended: true }))

// Enabling cookie parser
app.use(cookieParser());
// Enabling protection against cross site request forgery
app.use(csurf({ cookie: true }));
// connection to database
try {
    await db.authenticate();
    db.sync();
    console.log('connection successfull');
}
catch (error) {
    console.log(error);
}

// Routing
// asociando las rutas del objeto userRoutes al objetp app
/* 
    get busca una ruta en específico que has pasado,
    por lo que no va a funcionar con las otras rutas
    menos que especifiques el nombre como es el caso de abajo
    app.get('/about', userRoutes);
    entonces no funcionara con la otra ruta
*/

// Habilitar pug, se específica que view engine vamos a usar.
app.set('view engine', 'pug');
// Indicando en que carpeta se encuentran las vistas y ahí va a buscar
// de manera automatica.
app.set('views', './views');

// carpeta púbica, se usa para indicar la ubicación de los archivos estáticos
app.use(express.static('public'));
/* Use funciona con todas las rutas que usen '/', es decir
    no busca una ruta en específico
*/
app.use('/', appRoutes);
app.use('/auth', userRoutes);
app.use('/', propertiesRoutes);
app.use('/api', apiRoutes);


// Se pueden añadir varias configuraciones, pero lo único que 
// requieres ahora es definir un puerto y arrancar el proyecto
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server upp on port ${port}`)
});
