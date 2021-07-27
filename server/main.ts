import express, {Request, Response} from "express";
import * as dotenv from "dotenv";
import mysql from "mysql2";
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
app.get('/orders/:id',_api.getOrders);
app.get('/main.js',_api.serveBundleJS);

app.get('/item/:id',_api.getItem);
app.post('/item',_api.postItem);
app.patch('/item',_api.patchItem);
app.delete('/item/:id',_api.deleteItem);

app.get('/order/:id',_api.getOrder);
app.post('/order',_api.postOrder);
app.patch('/order',_api.patchOrder);
app.delete('/order/:id',_api.deleteOrder);

app.post('/login',_api.login);
app.post('/register',_api.register);

app.get('/user/:id',_api.getUser);
app.get('/users',_api.getUsers);

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
