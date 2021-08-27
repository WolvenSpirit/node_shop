"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.shutdown = exports.server = exports.db = exports.app = exports.s3Client = exports.testRun = exports.production = void 0;
const express_1 = __importDefault(require("express"));
const dotenv = __importStar(require("dotenv"));
const mysql2_1 = __importDefault(require("mysql2"));
const api_1 = require("./api");
const multer_1 = __importDefault(require("multer"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const _minio = require("minio");
exports.production = true;
exports.testRun = false;
const productionFalse = 'production=false';
const testRunTrue = 'test=true';
try {
    JSON.parse(process.env.PRODUCTION) === false ? exports.production = false : exports.production = true;
}
catch (e) {
    // Suppress error thrown by attempting to parse an undefined  variable.
    // Error: "Unexpected token u in JSON at position 0"
}
;
process.argv.forEach((arg, k) => {
    switch (arg) {
        case productionFalse:
            exports.production = false;
            break;
        case testRunTrue:
            exports.testRun = true;
            break;
    }
});
var storage = multer_1.default.diskStorage({
    destination: './bin/images',
    filename: function (r, fl, cb) {
        r.file = fl;
        const name = `${fl.fieldname}_${Date.now()}.${fl.mimetype.split('/')[1]}`;
        cb(null, name);
    }
});
var upload = multer_1.default({ storage: storage });
dotenv.config();
exports.app = express_1.default();
exports.app.use(cors_1.default());
const port = parseInt(process.env.PORT, 10);
exports.db = mysql2_1.default.createPool({
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT, 10),
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD
});
exports.app.use(express_1.default.json());
exports.app.use(body_parser_1.default.urlencoded({ extended: true, limit: 10000000 }));
exports.app.use('/images', express_1.default.static('bin/images'));
exports.app.use('/static/js', express_1.default.static('bin/client_dist/static/js'));
exports.app.use('/static/css', express_1.default.static('bin/client_dist/static/css'));
let _api = new api_1.api();
exports.app.get('/', _api.index);
exports.app.get('/items', _api.getItems);
exports.app.get('/orders', _api.getOrders);
exports.app.get('/item/:id', _api.getItem);
exports.app.post('/item', _api.postItem);
exports.app.patch('/item', _api.patchItem);
exports.app.delete('/item/:id', _api.deleteItem);
exports.app.get('/order/:id', _api.getOrder);
exports.app.post('/order', _api.postOrder);
exports.app.patch('/order', _api.patchOrder);
exports.app.delete('/order/:id', _api.deleteOrder);
exports.app.post('/login', _api.login);
exports.app.post('/register', _api.register);
exports.app.get('/user/:id', _api.getUser);
exports.app.get('/users', _api.getUsers);
if (process.env.S3_ENABLE === "true") {
    exports.s3Client = new _minio.Client({
        endPoint: process.env.S3_ENDPOINT,
        port: parseInt(process.env.S3_PORT, 10),
        useSSL: JSON.parse(process.env.S3_USESSL),
        accessKey: process.env.S3_ACCESSKEY,
        secretKey: process.env.S3_SECRETKEY
    });
    exports.s3Client.makeBucket(process.env.S3_BUCKET, process.env.S3_REGION, (err) => { err ? console.log(err.message) : null; });
    exports.app.post('/images', multer_1.default({ storage: multer_1.default.memoryStorage() }).single('image'), _api.uploadImagesS3);
}
else {
    exports.app.post('/images', upload.single('image'), _api.uploadImages);
}
exports.app.get('/verify', _api.verify);
exports.server = exports.app.listen(port, () => {
    console.debug(`[production]=(${exports.production})\n[test_run]=(${exports.testRun})\n`);
    console.log(`Listening on port ${port}...`);
});
function forceShutdown() {
    setTimeout(() => {
        console.log("Gracefully shutting down failed, forcing shutdown...");
        process.exit(1);
    }, 3000);
}
function shutdown() {
    console.log("Server closing");
    if (exports.server) {
        exports.server.close((err) => {
            if (err) {
                console.log(err.message);
            }
        });
    }
    if (exports.db) {
        exports.db.removeAllListeners();
        exports.db.end((err) => {
            if (err) {
                exports.db.removeAllListeners();
                console.log(err.message);
            }
        });
    }
    forceShutdown();
}
exports.shutdown = shutdown;
process.on('SIGINT', () => {
    console.info('Sigint received');
    shutdown();
});
process.on('SIGTERM', () => {
    console.info('Sigterm received');
    shutdown();
});
