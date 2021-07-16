import express from "express";
import * as dotenv from "dotenv";
import {router} from "./handlers";
import mysql from "mysql";

dotenv.config();

const app = express();

const port = parseInt(process.env.PORT as string,10);

export const db = mysql.createPool({
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT as string,10),
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD
});

app.use(express.json());

app.use(router);

app.listen(port, ()=> {

    console.log(`Listening on port ${port}...`)

});