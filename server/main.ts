import express from "express";
import * as dotenv from "dotenv";
import {api} from "./api";
import {router} from "./decorators";
import mysql from "mysql";

dotenv.config();

const app = express();

const port = parseInt(process.env.PORT as string,10);

export const db: mysql.Pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT as string,10),
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD
});

app.use(express.json());

let apiInstance = new api();

app.use(router);

let server = app.listen(port, ()=> {

    console.log(`Listening on port ${port}...`)

});

function shutdown(): void {
    console.log("Server closing")
    server.close()
    db.end()
}

process.on('SIGINT',()=>{
    console.info('Sigint received')
    shutdown();
});

process.on('SIGTERM',()=>{
    console.info('Sigterm received')
    shutdown();
});