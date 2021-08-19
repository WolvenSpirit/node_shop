import express, {Request, Response} from "express";
import * as dotenv from "dotenv";
import mysql from "mysql2";
import {api} from "./api";
import {config} from "./config";
import multer from "multer";
import bodyParser from "body-parser";
import cors from "cors";
import path from "path";
import Minio from 'minio';

const _minio = require("minio");

export let s3Client: Minio.Client;

var storage = multer.diskStorage({
    destination:'./bin/images',
    filename: function(r,fl,cb) {
        r.file = fl;
        const name = `${fl.fieldname}_${Date.now()}.${fl.mimetype.split('/')[1]}`;
        cb(null,name);
    }
});

var upload = multer({storage:storage});

dotenv.config();

export const app = express();

app.use(cors());

const port = parseInt(process.env.PORT as string,10);

export const db: mysql.Pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT as string,10),
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD
});

app.use(express.json());

app.use(bodyParser.urlencoded({extended:true,limit:10000000}));

app.use('/images',express.static('bin/images'));
app.use('/static/js',express.static('bin/client_dist/static/js'));
app.use('/static/css',express.static('bin/client_dist/static/css'));

let _api: api = new api();

app.get('/',_api.index);
app.get('/items',_api.getItems);
app.get('/orders',_api.getOrders);
// app.get('/main.js',_api.serveBundleJS);

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
if(process.env.S3_ENABLE === "true") {
    s3Client = new _minio.Client({
        endPoint: process.env.S3_ENDPOINT as string,
        port: parseInt(process.env.S3_PORT as string,10),
        useSSL: JSON.parse(process.env.S3_USESSL as string),
        accessKey: process.env.S3_ACCESSKEY as string,
        secretKey: process.env.S3_SECRETKEY as string
    });
        s3Client.makeBucket(process.env.S3_BUCKET as string,process.env.S3_REGION as string,(err:any)=>{err ? console.log(err.message) : null});
    app.post('/images',multer({storage:multer.memoryStorage()}).single('image'),_api.uploadImagesS3);
} else {
    app.post('/images',upload.single('image'),_api.uploadImages);
}

app.get('/verify',_api.verify)

export let server = app.listen(port, ()=> {

    console.log(`Listening on port ${port}...`)

});

export function shutdown(): void {
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
