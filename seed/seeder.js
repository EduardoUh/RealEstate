import { exit } from 'node:process'
import categories from "./categories.js";
import prices from './prices.js';
import users from './user.js';
import db from "../config/db.js";
import { Category, Price, User } from '../models/index.js';


const importData = async () => {
    try {
        // autenticarse en la bd
        await db.authenticate();
        // generar las columnas de categoria
        await db.sync();
        // insertar los datos de categories.js
        // await Category.bulkCreate(categories);
        await Promise.all([
            Category.bulkCreate(categories),
            Price.bulkCreate(prices),
            User.bulkCreate(users)
        ])
        console.log('Data imported successfully');
        exit();
    }
    catch (err) {
        console.log(err);
        exit(1);
    }
};

const deleteData = async () => {
    try {
        /* await Promise.all([
            Category.destroy({ where: {}, truncate: true }),
            Price.destroy({ where: {}, truncate: true })
        ]) */
        /* 
        La diferencia es que el  force elimina las tablas y 
        las crea de nuevo, el truncate elimina los datos y reinicia
        los id, la ventaja de force es que si tienes muchos modelos
        no tendrías que escribirlos todos como con el de arriba
        */
        await db.sync({ force: true })
        console.log('Successfully truncate tables');
        exit();
    }
    catch (err) {
        console.log(err);
        exit(1);
    }
};

if (process.argv[2] === "-i") {
    importData();
}

if (process.argv[2] === "-d") {
    deleteData();
}