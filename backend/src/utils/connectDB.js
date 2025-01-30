import mysql from 'mysql';
import dotenv from 'dotenv';

dotenv.config({path : '../../.env'});

var con = mysql.createConnection({
    host: "localhost",
    user: process.env.USER || "root",
    password: process.env.PASSWORD || "",
    database: "Shopdb"
});


export default con