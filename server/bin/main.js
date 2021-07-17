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
var express_1 = __importDefault(require("express"));
var dotenv = __importStar(require("dotenv"));
var handlers_1 = require("./handlers");
var mysql_1 = __importDefault(require("mysql"));
dotenv.config();
var app = express_1.default();
var port = parseInt(process.env.PORT, 10);
exports.db = mysql_1.default.createPool({
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT, 10),
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD
});
app.use(express_1.default.json());
app.use(handlers_1.router);
var server = app.listen(port, function () {
    console.log("Listening on port " + port + "...");
});
function shutdown() {
    console.log("Server closing");
    server.close();
    exports.db.end();
}
process.on('SIGINT', function () {
    console.info('Sigint received');
    shutdown();
});
process.on('SIGTERM', function () {
    console.info('Sigterm received');
    shutdown();
});
