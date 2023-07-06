import Sequelize from 'sequelize';
import dotenv from 'dotenv';
dotenv.config({ path: '.env' });

/* DB_NAME=bienesraices_db
DB_USER=root
DB_PASS=admin
DB_HOST=localhost */
const db = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
    host: process.env.DB_HOST,
    port: 3306,
    dialect: 'mysql',
    define: {
        timestamps: true
    },
    pool: {
        min: 0,
        max: 5,
        acquire: 30000,
        idle: 10000
    },
    operatorAliases: false
});

export default db;
