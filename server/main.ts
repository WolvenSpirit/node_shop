import express, {Request, Response} from "express";
import * as dotenv from "dotenv";
import mysql from "mysql";
import {api} from "./api";
import {config} from "./config";

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

let _api: api = new api();

app.get('/',_api.index);
app.get('/items',_api.getItems);
app.get('/orders',_api.getOrders);
app.get('/main.js',_api.serveBundleJS);

app.get('/item',_api.getItem);
app.post('/item',_api.postItem);
app.patch('/item',_api.patchItem);
app.delete('/item',_api.deleteItem);

app.get('/order',_api.getItem);
app.post('/order',_api.postItem);
app.patch('/order',_api.patchItem);
app.delete('/order',_api.deleteItem);

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
