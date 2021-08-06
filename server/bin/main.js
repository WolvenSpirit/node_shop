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
exports.db = void 0;
const express_1 = __importDefault(require("express"));
const dotenv = __importStar(require("dotenv"));
const mysql2_1 = __importDefault(require("mysql2"));
const api_1 = require("./api");
const multer_1 = __importDefault(require("multer"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
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
const app = express_1.default();
app.use(cors_1.default());
const port = parseInt(process.env.PORT, 10);
exports.db = mysql2_1.default.createPool({
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT, 10),
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD
});
app.use(express_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true, limit: 10000000 }));
app.use('/images', express_1.default.static('bin/images'));
app.use('/static/js', express_1.default.static('bin/client_dist/static/js'));
app.use('/static/css', express_1.default.static('bin/client_dist/static/css'));
let _api = new api_1.api();
app.get('/', _api.index);
app.get('/items', _api.getItems);
app.get('/orders/:id', _api.getOrders);
// app.get('/main.js',_api.serveBundleJS);
app.get('/item/:id', _api.getItem);
app.post('/item', _api.postItem);
app.patch('/item', _api.patchItem);
app.delete('/item/:id', _api.deleteItem);
app.get('/order/:id', _api.getOrder);
app.post('/order', _api.postOrder);
app.patch('/order', _api.patchOrder);
app.delete('/order/:id', _api.deleteOrder);
app.post('/login', _api.login);
app.post('/register', _api.register);
app.get('/user/:id', _api.getUser);
app.get('/users', _api.getUsers);
app.post('/images', upload.single('image'), _api.uploadImages);
app.get('/verify', _api.verify);
let server = app.listen(port, () => {
    console.log(`Listening on port ${port}...`);
});
function shutdown() {
    console.log("Server closing");
    server.close();
    exports.db.end();
}
process.on('SIGINT', () => {
    console.info('Sigint received');
    shutdown();
});
process.on('SIGTERM', () => {
    console.info('Sigterm received');
    shutdown();
});
